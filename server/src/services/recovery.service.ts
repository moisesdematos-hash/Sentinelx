import crypto from 'crypto';
import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const rollbackRequestSchema = z.object({
  assetId: z.string(),
  baselineId: z.string().optional(),
});

export const restoreAssetSchema = z.object({
  assetId: z.string(),
});

export class RecoveryService {
  static async listBaselines(organizationId: string) {
    const assets = await prisma.asset.findMany({
      where: { organizationId },
      include: {
        baselines: { orderBy: { version: 'desc' } },
      },
    });

    const baselines: any[] = [];
    for (const asset of assets) {
      if (asset.baselines.length === 0) {
        // Seed default baseline
        const defaultConfig = JSON.stringify({
          target: asset.target,
          criticality: asset.criticality,
          status: 'MONITORED',
          securityScore: 100,
        });

        const hash = crypto.createHash('sha256').update(defaultConfig).digest('hex');
        const b = await prisma.assetBaseline.create({
          data: {
            assetId: asset.id,
            version: 1,
            configuration: defaultConfig,
            hash,
            isLocked: true,
          },
        });
        baselines.push({ ...b, assetName: asset.name, assetTarget: asset.target });
      } else {
        asset.baselines.forEach((b) => {
          baselines.push({ ...b, assetName: asset.name, assetTarget: asset.target });
        });
      }
    }

    return baselines;
  }

  static async executeRollback(
    organizationId: string,
    data: z.infer<typeof rollbackRequestSchema>,
    userId?: string
  ) {
    const asset = await prisma.asset.findFirst({
      where: { id: data.assetId, organizationId },
      include: { baselines: { orderBy: { version: 'desc' } } },
    });

    if (!asset) {
      throw new AppError(404, 'Target asset for rollback not found', 'NOT_FOUND');
    }

    let targetBaseline = asset.baselines[0];
    if (data.baselineId) {
      const found = asset.baselines.find((b) => b.id === data.baselineId);
      if (found) targetBaseline = found;
    }

    if (!targetBaseline) {
      // Create fallback baseline
      const defaultConfig = JSON.stringify({
        target: asset.target,
        criticality: asset.criticality,
        status: 'MONITORED',
        securityScore: 100,
      });
      const hash = crypto.createHash('sha256').update(defaultConfig).digest('hex');
      targetBaseline = await prisma.assetBaseline.create({
        data: {
          assetId: asset.id,
          version: 1,
          configuration: defaultConfig,
          hash,
          isLocked: true,
        },
      });
    }

    // SHA-256 Hash Integrity Verification
    const computedHash = crypto.createHash('sha256').update(targetBaseline.configuration).digest('hex');
    if (computedHash !== targetBaseline.hash) {
      throw new AppError(400, 'Baseline configuration hash integrity check failed', 'INTEGRITY_FAILED');
    }

    const previousState = JSON.stringify({
      assetId: asset.id,
      status: asset.status,
      securityScore: asset.securityScore,
    });

    // Revert asset to operational baseline state
    const updatedAsset = await prisma.asset.update({
      where: { id: asset.id },
      data: {
        status: 'MONITORED',
        securityScore: 100,
      },
    });

    const rollbackRecord = await prisma.rollbackRecord.create({
      data: {
        organizationId,
        assetId: asset.id,
        baselineId: targetBaseline.id,
        actionType: 'ROLLBACK_EXECUTED',
        previousState,
        restoredState: JSON.stringify(updatedAsset),
        integrityHash: targetBaseline.hash,
        status: 'COMPLETED',
        executedBy: userId ?? 'Security Analyst',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'RollbackExecuted', {
      rollbackId: rollbackRecord.id,
      assetId: asset.id,
      baselineVersion: targetBaseline.version,
      integrityHash: targetBaseline.hash,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ROLLBACK_EXECUTED',
      resource: 'RollbackRecord',
      resourceId: rollbackRecord.id,
      details: { assetId: asset.id, baselineVersion: targetBaseline.version },
    });

    return rollbackRecord;
  }

  static async restoreAsset(
    organizationId: string,
    data: z.infer<typeof restoreAssetSchema>,
    userId?: string
  ) {
    const asset = await prisma.asset.findFirst({
      where: { id: data.assetId, organizationId },
    });

    if (!asset) {
      throw new AppError(404, 'Asset not found for recovery', 'NOT_FOUND');
    }

    const previousState = JSON.stringify({ status: asset.status });

    const restored = await prisma.asset.update({
      where: { id: asset.id },
      data: {
        status: 'MONITORED',
        securityScore: 100,
      },
    });

    const integrityHash = crypto.createHash('sha256').update(JSON.stringify(restored)).digest('hex');

    const rollbackRecord = await prisma.rollbackRecord.create({
      data: {
        organizationId,
        assetId: asset.id,
        actionType: 'ASSET_RESTORED',
        previousState,
        restoredState: JSON.stringify(restored),
        integrityHash,
        status: 'COMPLETED',
        executedBy: userId ?? 'Security Analyst',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'RecoveryExecuted', {
      rollbackId: rollbackRecord.id,
      assetId: asset.id,
      status: restored.status,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ASSET_RECOVERY_EXECUTED',
      resource: 'RollbackRecord',
      resourceId: rollbackRecord.id,
      details: { assetId: asset.id },
    });

    return rollbackRecord;
  }

  static async listRollbacks(organizationId: string) {
    return prisma.rollbackRecord.findMany({
      where: { organizationId },
      include: {
        asset: { select: { id: true, name: true, target: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }
}
