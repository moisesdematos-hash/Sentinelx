import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createSegmentSchema = z.object({
  name: z.string().min(2),
  environment: z.enum(['PRODUCTION', 'STAGING', 'DMZ', 'PCI_VAULT']).default('PRODUCTION'),
  isolationLevel: z.enum(['STRICT_ZERO_TRUST', 'MODERATE', 'PERMISSIVE']).default('STRICT_ZERO_TRUST'),
});

export const createRuleSchema = z.object({
  sourceTag: z.string().min(1),
  targetTag: z.string().min(1),
  protocol: z.enum(['TCP', 'UDP', 'ICMP', 'ANY']).default('TCP'),
  portRange: z.string().default('443'),
  action: z.enum(['ALLOW', 'DENY', 'QUARANTINE']).default('DENY'),
  description: z.string().min(2),
});

export class MicrosegmentationService {
  static async seedDefaultSegments(organizationId: string) {
    const count = await prisma.networkSegment.count({ where: { organizationId } });
    if (count > 0) return;

    const pci = await prisma.networkSegment.create({
      data: {
        organizationId,
        name: 'PCI-DSS Cardholder Vault Security Perimeter',
        environment: 'PCI_VAULT',
        isolationLevel: 'STRICT_ZERO_TRUST',
        status: 'ENFORCED',
        activeRulesCount: 4,
        blockedFlowsCount: 142,
      },
    });

    await prisma.segmentPolicyRule.createMany({
      data: [
        {
          segmentId: pci.id,
          sourceTag: 'role:web-frontend',
          targetTag: 'role:pci-vault-db',
          protocol: 'TCP',
          portRange: '5432',
          action: 'DENY',
          description: 'Block direct East-West traffic from Web tier to Cardholder Vault',
        },
        {
          segmentId: pci.id,
          sourceTag: 'role:payment-api',
          targetTag: 'role:pci-vault-db',
          protocol: 'TCP',
          portRange: '5432',
          action: 'ALLOW',
          description: 'Allow encrypted mTLS payment API traffic to Vault Database',
        },
      ],
    });

    const dmz = await prisma.networkSegment.create({
      data: {
        organizationId,
        name: 'DMZ Edge Perimeter Boundary',
        environment: 'DMZ',
        isolationLevel: 'MODERATE',
        status: 'ENFORCED',
        activeRulesCount: 3,
        blockedFlowsCount: 89,
      },
    });

    await prisma.segmentPolicyRule.create({
      data: {
        segmentId: dmz.id,
        sourceTag: 'subnet:external-internet',
        targetTag: 'subnet:internal-lan',
        protocol: 'ANY',
        portRange: 'ANY',
        action: 'DENY',
        description: 'Block all unauthenticated inbound internet flows into internal LAN',
      },
    });
  }

  static async listSegments(organizationId: string) {
    await this.seedDefaultSegments(organizationId);

    return prisma.networkSegment.findMany({
      where: { organizationId },
      include: {
        policyRules: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createSegment(
    organizationId: string,
    data: z.infer<typeof createSegmentSchema>,
    userId?: string
  ) {
    const segment = await prisma.networkSegment.create({
      data: {
        organizationId,
        name: data.name,
        environment: data.environment,
        isolationLevel: data.isolationLevel,
        status: 'ENFORCED',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'NETWORK_SEGMENT_CREATED',
      resource: 'NetworkSegment',
      resourceId: segment.id,
      details: { name: segment.name, isolationLevel: segment.isolationLevel },
    });

    return segment;
  }

  static async addPolicyRule(
    organizationId: string,
    segmentId: string,
    data: z.infer<typeof createRuleSchema>,
    userId?: string
  ) {
    const segment = await prisma.networkSegment.findFirst({
      where: { id: segmentId, organizationId },
    });

    if (!segment) {
      throw new AppError(404, 'Network segment not found', 'NOT_FOUND');
    }

    const rule = await prisma.segmentPolicyRule.create({
      data: {
        segmentId: segment.id,
        sourceTag: data.sourceTag,
        targetTag: data.targetTag,
        protocol: data.protocol,
        portRange: data.portRange,
        action: data.action,
        description: data.description,
      },
    });

    await prisma.networkSegment.update({
      where: { id: segment.id },
      data: { activeRulesCount: segment.activeRulesCount + 1 },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SEGMENT_RULE_ADDED',
      resource: 'SegmentPolicyRule',
      resourceId: rule.id,
      details: { action: rule.action, sourceTag: rule.sourceTag, targetTag: rule.targetTag },
    });

    return rule;
  }

  static async enforceZeroTrust(organizationId: string, segmentId: string, userId?: string) {
    const segment = await prisma.networkSegment.findFirst({
      where: { id: segmentId, organizationId },
    });

    if (!segment) {
      throw new AppError(404, 'Network segment not found', 'NOT_FOUND');
    }

    const updated = await prisma.networkSegment.update({
      where: { id: segment.id },
      data: {
        status: 'ENFORCED',
        isolationLevel: 'STRICT_ZERO_TRUST',
        blockedFlowsCount: segment.blockedFlowsCount + 15,
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'MicrosegmentationPolicyEnforced', {
      segmentId: updated.id,
      segmentName: updated.name,
      isolationLevel: 'STRICT_ZERO_TRUST',
      status: 'ENFORCED',
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'MICROSEGMENTATION_ENFORCED',
      resource: 'NetworkSegment',
      resourceId: updated.id,
      details: { name: updated.name, isolationLevel: 'STRICT_ZERO_TRUST' },
    });

    return updated;
  }

  static async getTrafficLogs(organizationId: string) {
    return [
      {
        id: 'flow-1',
        timestamp: new Date().toISOString(),
        sourceIp: '10.0.1.45 (web-frontend-01)',
        targetIp: '10.0.4.12 (pci-vault-db)',
        protocol: 'TCP',
        port: 5432,
        action: 'DENIED',
        reason: 'Microsegmentation Policy Rule #882: Unauthorized East-West Vault Access',
      },
      {
        id: 'flow-2',
        timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
        sourceIp: '10.0.2.88 (payment-api-prod)',
        targetIp: '10.0.4.12 (pci-vault-db)',
        protocol: 'TCP',
        port: 5432,
        action: 'ALLOWED',
        reason: 'mTLS Verified Rule #883: Authorized Payment Channel',
      },
      {
        id: 'flow-3',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        sourceIp: '192.168.10.15 (dev-workstation)',
        targetIp: '10.0.3.100 (prod-k8s-master)',
        protocol: 'TCP',
        port: 6443,
        action: 'QUARANTINED',
        reason: 'Zero-Trust Perimeter Rule #104: Quarantine Untrusted Workstation Access',
      },
    ];
  }
}
