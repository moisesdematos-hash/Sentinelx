import crypto from 'crypto';
import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const shareThreatSchema = z.object({
  indicatorType: z.enum(['IP', 'DOMAIN', 'PAYLOAD_HASH', 'USER_AGENT']),
  indicatorValue: z.string().min(3),
  threatCategory: z.enum(['BRUTE_FORCE', 'EXPLOIT_PAYLOAD', 'PHISHING_DOMAIN', 'BOTNET']).default('EXPLOIT_PAYLOAD'),
});

export class ThreatExchangeService {
  static async seedDefaultGlobalThreats(organizationId: string) {
    const count = await prisma.globalThreatExchange.count({ where: { organizationId } });
    if (count === 0) {
      const anonHash = `anon_node_${crypto.createHash('sha256').update(organizationId).digest('hex').substring(0, 12)}`;

      await prisma.globalThreatExchange.createMany({
        data: [
          {
            organizationId,
            anonymousNodeHash: anonHash,
            indicatorType: 'IP',
            indicatorValue: '185.220.101.9',
            threatCategory: 'EXPLOIT_PAYLOAD',
            confidenceScore: 98,
            status: 'BROADCASTED',
          },
          {
            organizationId,
            anonymousNodeHash: anonHash,
            indicatorType: 'DOMAIN',
            indicatorValue: 'malicious-phish-auth.xyz',
            threatCategory: 'PHISHING_DOMAIN',
            confidenceScore: 95,
            status: 'BROADCASTED',
          },
        ],
      });
    }
  }

  static async listIndicators(organizationId: string) {
    await this.seedDefaultGlobalThreats(organizationId);

    return prisma.globalThreatExchange.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
    });
  }

  static async shareThreat(
    organizationId: string,
    data: z.infer<typeof shareThreatSchema>,
    userId?: string
  ) {
    await this.seedDefaultGlobalThreats(organizationId);

    const anonHash = `anon_node_${crypto.createHash('sha256').update(organizationId + Date.now()).digest('hex').substring(0, 12)}`;

    const threat = await prisma.globalThreatExchange.create({
      data: {
        organizationId,
        anonymousNodeHash: anonHash,
        indicatorType: data.indicatorType,
        indicatorValue: data.indicatorValue,
        threatCategory: data.threatCategory,
        confidenceScore: 99,
        status: 'BROADCASTED',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'GlobalThreatBroadcasted', {
      threatId: threat.id,
      anonymousNodeHash: threat.anonymousNodeHash,
      indicatorType: threat.indicatorType,
      indicatorValue: threat.indicatorValue,
      confidenceScore: threat.confidenceScore,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'GLOBAL_THREAT_INDICATOR_SHARED',
      resource: 'GlobalThreatExchange',
      resourceId: threat.id,
      details: { indicatorType: threat.indicatorType, anonymousNodeHash: threat.anonymousNodeHash },
    });

    return threat;
  }

  static async syncBlocklist(organizationId: string, userId?: string) {
    await this.seedDefaultGlobalThreats(organizationId);

    const updated = await prisma.globalThreatExchange.updateMany({
      where: { organizationId, status: 'BROADCASTED' },
      data: { status: 'SYNCED' },
    });

    const indicators = await prisma.globalThreatExchange.findMany({ where: { organizationId } });

    await WebhookService.dispatchEvent(organizationId, 'GlobalThreatBroadcasted', {
      action: 'COLLECTIVE_BLOCKLIST_SYNCED_TO_WAF',
      syncedCount: updated.count,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'COLLECTIVE_THREAT_BLOCKLIST_SYNCED',
      resource: 'GlobalThreatExchange',
      details: { syncedCount: updated.count },
    });

    return { success: true, syncedCount: updated.count, indicators };
  }
}
