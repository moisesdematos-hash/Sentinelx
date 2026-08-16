import crypto from 'crypto';
import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { z } from 'zod';
import { AuditService } from './audit.service.js';

export const createAssetSchema = z.object({
  name: z.string().min(2, 'Asset name required'),
  type: z.enum(['WEBSITE', 'API', 'SERVER', 'CLOUD', 'CONTAINER']),
  target: z.string().min(1, 'Target address/hostname/ARN required'),
  environment: z.enum(['PRODUCTION', 'STAGING', 'DEVELOPMENT', 'SANDBOX']).default('PRODUCTION'),
  criticality: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  owner: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export class AssetService {
  static async create(
    organizationId: string,
    data: z.infer<typeof createAssetSchema>,
    userId?: string
  ) {
    const asset = await prisma.asset.create({
      data: {
        organizationId,
        name: data.name,
        type: data.type,
        target: data.target,
        environment: data.environment,
        criticality: data.criticality,
        owner: data.owner,
        tags: JSON.stringify(data.tags || []),
        metadata: JSON.stringify(data.metadata || {}),
        status: 'MONITORED',
        securityScore: this.calculateInitialScore(data.criticality, data.environment),
      },
    });

    // Auto-create initial KNOWN_GOOD_BASELINE
    const defaultConfig = {
      name: asset.name,
      type: asset.type,
      target: asset.target,
      environment: asset.environment,
      criticality: asset.criticality,
      initialMetadata: data.metadata || {},
    };
    const configString = JSON.stringify(defaultConfig);
    const hash = crypto.createHash('sha256').update(configString).digest('hex');

    await prisma.assetBaseline.create({
      data: {
        assetId: asset.id,
        version: 1,
        configuration: configString,
        hash,
        isLocked: true,
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ASSET_CREATED',
      resource: 'Asset',
      resourceId: asset.id,
      details: { name: asset.name, type: asset.type, target: asset.target },
    });

    return {
      ...asset,
      tags: JSON.parse(asset.tags || '[]'),
      metadata: JSON.parse(asset.metadata || '{}'),
    };
  }

  static async listByOrganization(
    organizationId: string,
    filters?: { type?: string; environment?: string; criticality?: string; search?: string }
  ) {
    const where: any = { organizationId };

    if (filters?.type) where.type = filters.type;
    if (filters?.environment) where.environment = filters.environment;
    if (filters?.criticality) where.criticality = filters.criticality;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { target: { contains: filters.search } },
        { owner: { contains: filters.search } },
      ];
    }

    const assets = await prisma.asset.findMany({
      where,
      include: {
        baselines: {
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return assets.map((a) => ({
      ...a,
      tags: JSON.parse(a.tags || '[]'),
      metadata: JSON.parse(a.metadata || '{}'),
      latestBaseline: a.baselines[0]
        ? {
            ...a.baselines[0],
            configuration: JSON.parse(a.baselines[0].configuration || '{}'),
          }
        : null,
    }));
  }

  static async getById(organizationId: string, id: string) {
    const asset = await prisma.asset.findFirst({
      where: { id, organizationId },
      include: {
        baselines: {
          orderBy: { version: 'desc' },
        },
      },
    });

    if (!asset) {
      throw new AppError(404, 'Asset not found or access denied', 'ASSET_NOT_FOUND');
    }

    return {
      ...asset,
      tags: JSON.parse(asset.tags || '[]'),
      metadata: JSON.parse(asset.metadata || '{}'),
      baselines: asset.baselines.map((b) => ({
        ...b,
        configuration: JSON.parse(b.configuration || '{}'),
      })),
    };
  }

  static async update(
    organizationId: string,
    id: string,
    data: z.infer<typeof updateAssetSchema>,
    userId?: string
  ) {
    const existing = await this.getById(organizationId, id);

    const updated = await prisma.asset.update({
      where: { id: existing.id },
      data: {
        name: data.name ?? existing.name,
        type: data.type ?? existing.type,
        target: data.target ?? existing.target,
        environment: data.environment ?? existing.environment,
        criticality: data.criticality ?? existing.criticality,
        owner: data.owner ?? existing.owner,
        tags: data.tags ? JSON.stringify(data.tags) : existing.tags,
        metadata: data.metadata ? JSON.stringify(data.metadata) : existing.metadata,
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ASSET_UPDATED',
      resource: 'Asset',
      resourceId: id,
      details: { name: updated.name, type: updated.type },
    });

    return {
      ...updated,
      tags: JSON.parse(updated.tags || '[]'),
      metadata: JSON.parse(updated.metadata || '{}'),
    };
  }

  static async lockBaseline(organizationId: string, id: string, userId?: string) {
    const asset = await this.getById(organizationId, id);
    const latestVersion = asset.baselines.length > 0 ? asset.baselines[0].version + 1 : 1;

    const currentConfig = {
      name: asset.name,
      type: asset.type,
      target: asset.target,
      environment: asset.environment,
      criticality: asset.criticality,
      owner: asset.owner,
      metadata: asset.metadata,
      lockedAt: new Date().toISOString(),
    };

    const configString = JSON.stringify(currentConfig);
    const hash = crypto.createHash('sha256').update(configString).digest('hex');

    const baseline = await prisma.assetBaseline.create({
      data: {
        assetId: asset.id,
        version: latestVersion,
        configuration: configString,
        hash,
        isLocked: true,
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ASSET_BASELINE_LOCKED',
      resource: 'AssetBaseline',
      resourceId: baseline.id,
      details: { assetName: asset.name, version: latestVersion, hash },
    });

    return {
      ...baseline,
      configuration: JSON.parse(baseline.configuration),
    };
  }

  static async delete(organizationId: string, id: string, userId?: string) {
    const asset = await this.getById(organizationId, id);

    await prisma.asset.delete({ where: { id: asset.id } });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ASSET_DELETED',
      resource: 'Asset',
      resourceId: id,
      details: { name: asset.name, type: asset.type },
    });

    return { id };
  }

  private static calculateInitialScore(criticality: string, environment: string): number {
    let score = 100;
    if (criticality === 'CRITICAL' && environment === 'PRODUCTION') {
      score = 98; // Strict baseline monitoring
    } else if (environment === 'STAGING') {
      score = 95;
    }
    return score;
  }
}
