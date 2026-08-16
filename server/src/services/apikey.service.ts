import crypto from 'crypto';
import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { z } from 'zod';
import { AuditService } from './audit.service.js';

export const createApiKeySchema = z.object({
  name: z.string().min(2, 'Key name required'),
  permissions: z.string().default('read,write'),
  expiresInDays: z.number().optional(),
});

export class ApiKeyService {
  static async create(
    organizationId: string,
    data: z.infer<typeof createApiKeySchema>,
    userId?: string
  ) {
    // Generate secure random key: sk_live_<32 hex chars>
    const randomBytes = crypto.randomBytes(24).toString('hex');
    const rawKey = `sk_live_${randomBytes}`;
    const prefix = `sk_live_${randomBytes.substring(0, 6)}...`;
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    const expiresAt = data.expiresInDays
      ? new Date(Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const apiKeyRecord = await prisma.apiKey.create({
      data: {
        organizationId,
        name: data.name,
        keyHash,
        prefix,
        permissions: data.permissions,
        expiresAt,
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'API_KEY_CREATED',
      resource: 'ApiKey',
      resourceId: apiKeyRecord.id,
      details: { name: apiKeyRecord.name, prefix },
    });

    return {
      id: apiKeyRecord.id,
      name: apiKeyRecord.name,
      prefix: apiKeyRecord.prefix,
      rawKey, // Returned ONLY once upon creation!
      permissions: apiKeyRecord.permissions,
      expiresAt: apiKeyRecord.expiresAt,
      createdAt: apiKeyRecord.createdAt,
    };
  }

  static async listByOrganization(organizationId: string) {
    return prisma.apiKey.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        prefix: true,
        permissions: true,
        expiresAt: true,
        lastUsedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async revoke(organizationId: string, id: string, userId?: string) {
    const key = await prisma.apiKey.findFirst({
      where: { id, organizationId },
    });

    if (!key) {
      throw new AppError(404, 'API Key not found or access denied', 'NOT_FOUND');
    }

    await prisma.apiKey.delete({ where: { id: key.id } });

    await AuditService.record({
      organizationId,
      userId,
      action: 'API_KEY_REVOKED',
      resource: 'ApiKey',
      resourceId: id,
      details: { name: key.name, prefix: key.prefix },
    });

    return { id };
  }
}
