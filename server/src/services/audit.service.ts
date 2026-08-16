import { prisma } from '../db/client.js';
import { logger } from '../utils/logger.js';

export interface CreateAuditLogParams {
  organizationId: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  status?: 'SUCCESS' | 'FAILURE' | 'DENIED';
}

export class AuditService {
  static async record(params: CreateAuditLogParams) {
    try {
      const log = await prisma.auditLog.create({
        data: {
          organizationId: params.organizationId,
          userId: params.userId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
          action: params.action,
          resource: params.resource,
          resourceId: params.resourceId,
          details: JSON.stringify(params.details || {}),
          status: params.status || 'SUCCESS',
        },
      });

      logger.info(
        {
          auditId: log.id,
          org: params.organizationId,
          action: params.action,
          resource: params.resource,
        },
        'Audit log recorded'
      );

      return log;
    } catch (err) {
      logger.error({ err, params }, 'Failed to write audit log entry');
    }
  }

  static async listByOrganization(organizationId: string, limit = 50, page = 1) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { organizationId },
        orderBy: { timestamp: 'desc' },
        take: limit,
        skip,
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.auditLog.count({ where: { organizationId } }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        details: JSON.parse(item.details || '{}'),
      })),
      total,
      page,
      limit,
    };
  }
}
