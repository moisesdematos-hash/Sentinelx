import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createJitRequestSchema = z.object({
  requesterEmail: z.string().email(),
  requestedRole: z.enum(['JIT_SUPER_ADMIN', 'JIT_PROD_DB_ACCESS', 'JIT_CONTAINER_ROOT']),
  targetResource: z.string().min(1),
  durationHours: z.number().int().min(1).max(24).default(1),
});

export class IdentityService {
  static async seedDefaultIdentities(organizationId: string) {
    const count = await prisma.identityRisk.count({ where: { organizationId } });
    if (count > 0) return;

    await prisma.identityRisk.createMany({
      data: [
        {
          organizationId,
          identityName: 'admin@sentinelx.io',
          identityType: 'HUMAN_USER',
          riskScore: 12,
          riskFactors: JSON.stringify(['MFA Verified', 'Standard Geo Access']),
          status: 'MONITORED',
        },
        {
          organizationId,
          identityName: 'arn:aws:iam::123456789012:role/DevOpsAdminRole',
          identityType: 'IAM_ROLE',
          riskScore: 78,
          riskFactors: JSON.stringify(['Shadow Admin Wildcard Access', 'Unused Admin Policies']),
          status: 'SUSPICIOUS',
        },
        {
          organizationId,
          identityName: 'svc-backup-automation@sentinelx.io',
          identityType: 'SERVICE_ACCOUNT',
          riskScore: 15,
          riskFactors: JSON.stringify(['Key Rotated 12 days ago']),
          status: 'MONITORED',
        },
        {
          organizationId,
          identityName: 'apikey_live_prod_exporter_9921',
          identityType: 'API_KEY',
          riskScore: 92,
          riskFactors: JSON.stringify(['Impossible Travel Detected (US -> RO in 5 mins)']),
          status: 'SUSPICIOUS',
        },
      ],
    });
  }

  static async listRisks(organizationId: string) {
    await this.seedDefaultIdentities(organizationId);

    return prisma.identityRisk.findMany({
      where: { organizationId },
      orderBy: { riskScore: 'desc' },
    });
  }

  static async createJitRequest(
    organizationId: string,
    data: z.infer<typeof createJitRequestSchema>,
    userId?: string
  ) {
    const request = await prisma.jitAccessRequest.create({
      data: {
        organizationId,
        requesterEmail: data.requesterEmail,
        requestedRole: data.requestedRole,
        targetResource: data.targetResource,
        durationHours: data.durationHours,
        status: 'PENDING',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'JIT_ACCESS_REQUESTED',
      resource: 'JitAccessRequest',
      resourceId: request.id,
      details: { requesterEmail: request.requesterEmail, requestedRole: request.requestedRole },
    });

    return request;
  }

  static async listJitRequests(organizationId: string) {
    return prisma.jitAccessRequest.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  static async approveJitRequest(
    organizationId: string,
    requestId: string,
    approved: boolean,
    userId?: string
  ) {
    const request = await prisma.jitAccessRequest.findFirst({
      where: { id: requestId, organizationId },
    });

    if (!request) {
      throw new AppError(404, 'JIT access request not found', 'NOT_FOUND');
    }

    const expiresAt = approved
      ? new Date(Date.now() + request.durationHours * 60 * 60 * 1000)
      : null;

    const updated = await prisma.jitAccessRequest.update({
      where: { id: request.id },
      data: {
        status: approved ? 'APPROVED' : 'REVOKED',
        approvedBy: userId || 'SENTINELX Governance Engine',
        expiresAt,
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: approved ? 'JIT_ACCESS_APPROVED' : 'JIT_ACCESS_REVOKED',
      resource: 'JitAccessRequest',
      resourceId: updated.id,
      details: { requestedRole: updated.requestedRole, expiresAt },
    });

    return updated;
  }

  static async lockoutIdentity(organizationId: string, riskId: string, userId?: string) {
    const risk = await prisma.identityRisk.findFirst({
      where: { id: riskId, organizationId },
    });

    if (!risk) {
      throw new AppError(404, 'Identity risk record not found', 'NOT_FOUND');
    }

    const updated = await prisma.identityRisk.update({
      where: { id: risk.id },
      data: {
        status: 'LOCKED_OUT',
        riskScore: 100,
        lastEvaluatedAt: new Date(),
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'IdentityRiskElevated', {
      identityId: updated.id,
      identityName: updated.identityName,
      identityType: updated.identityType,
      status: 'LOCKED_OUT',
      riskScore: 100,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'EMERGENCY_ACCOUNT_LOCKOUT',
      resource: 'IdentityRisk',
      resourceId: updated.id,
      details: { identityName: updated.identityName },
    });

    return updated;
  }
}
