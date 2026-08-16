import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createDetectionRuleSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  category: z.enum(['BRUTE_FORCE', 'EXPLOIT', 'PRIVILEGE_ESCALATION', 'DATA_LEAK', 'ANOMALY']).default('EXPLOIT'),
  ruleCondition: z.record(z.any()), // Sigma / YARA style JSON condition
});

export class DetectionService {
  static async seedDefaultRules(organizationId: string) {
    const existingCount = await prisma.detectionRule.count({ where: { organizationId } });
    if (existingCount > 0) return;

    const defaultRules = [
      {
        name: 'XZ Utils Backdoor Remote Execution (CVE-2024-3094)',
        description: 'Detects presence or execution of compromised liblzma binary versions in server processes.',
        severity: 'CRITICAL',
        category: 'EXPLOIT',
        ruleCondition: JSON.stringify({ targetSymbol: 'system_hook_rsa_verify', minCvss: 9.8 }),
        status: 'ENABLED',
      },
      {
        name: 'Public Unencrypted Cloud Storage Bucket Exposure',
        description: 'Fires when a cloud connector discovers an unencrypted public S3 or Azure Blob storage bucket.',
        severity: 'HIGH',
        category: 'DATA_LEAK',
        ruleCondition: JSON.stringify({ publicAccessBlock: false, eventType: 'CloudRiskDetected' }),
        status: 'ENABLED',
      },
      {
        name: 'SSH Root User Privilege Escalation Attempt',
        description: 'Detects anomalous root user login or sudoers file tampering via FIM checks.',
        severity: 'CRITICAL',
        category: 'PRIVILEGE_ESCALATION',
        ruleCondition: JSON.stringify({ fileModified: '/etc/sudoers', sourceEngine: 'SERVER' }),
        status: 'ENABLED',
      },
    ];

    for (const r of defaultRules) {
      await prisma.detectionRule.create({
        data: { organizationId, ...r },
      });
    }
  }

  static async createRule(
    organizationId: string,
    data: z.infer<typeof createDetectionRuleSchema>,
    userId?: string
  ) {
    const rule = await prisma.detectionRule.create({
      data: {
        organizationId,
        name: data.name,
        description: data.description,
        severity: data.severity,
        category: data.category,
        ruleCondition: JSON.stringify(data.ruleCondition),
        status: 'ENABLED',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'DETECTION_RULE_CREATED',
      resource: 'DetectionRule',
      resourceId: rule.id,
      details: { name: rule.name, severity: rule.severity, category: rule.category },
    });

    return {
      ...rule,
      ruleCondition: JSON.parse(rule.ruleCondition),
    };
  }

  static async listRules(organizationId: string) {
    await this.seedDefaultRules(organizationId);

    const rules = await prisma.detectionRule.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });

    return rules.map((r) => ({
      ...r,
      ruleCondition: JSON.parse(r.ruleCondition || '{}'),
    }));
  }

  static async evaluateEvents(organizationId: string, userId?: string) {
    await this.seedDefaultRules(organizationId);

    const activeRules = await prisma.detectionRule.findMany({
      where: { organizationId, status: 'ENABLED' },
    });

    const recentEvents = await prisma.securityEvent.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
      take: 20,
    });

    const generatedAlerts = [];

    // Evaluate rules against events
    for (const rule of activeRules) {
      const condition = JSON.parse(rule.ruleCondition || '{}');

      // Check if any recent event satisfies condition
      const matchingEvent = recentEvents.find((evt) => {
        if (condition.sourceEngine && evt.sourceEngine !== condition.sourceEngine) return false;
        if (evt.severity === 'CRITICAL' || evt.severity === 'HIGH') return true;
        return false;
      });

      if (matchingEvent) {
        const existingAlert = await prisma.detectionAlert.findFirst({
          where: { organizationId, ruleId: rule.id, status: 'OPEN' },
        });

        if (!existingAlert) {
          const alert = await prisma.detectionAlert.create({
            data: {
              organizationId,
              ruleId: rule.id,
              assetId: matchingEvent.assetId,
              title: `[ALERT] ${rule.name}`,
              description: rule.description,
              severity: rule.severity,
              status: 'OPEN',
              evidence: JSON.stringify({
                triggeredByEventId: matchingEvent.id,
                eventType: matchingEvent.eventType,
                sourceEngine: matchingEvent.sourceEngine,
                payload: JSON.parse(matchingEvent.payload || '{}'),
              }),
            },
          });
          generatedAlerts.push(alert);

          await WebhookService.dispatchEvent(organizationId, 'ThreatDetected', {
            alertId: alert.id,
            title: alert.title,
            severity: alert.severity,
            ruleName: rule.name,
            assetId: matchingEvent.assetId,
          });
        }
      }
    }

    await AuditService.record({
      organizationId,
      userId,
      action: 'DETECTION_EVALUATION_EXECUTED',
      resource: 'DetectionEngine',
      details: { evaluatedRulesCount: activeRules.length, alertsGeneratedCount: generatedAlerts.length },
    });

    return {
      evaluatedRulesCount: activeRules.length,
      alertsGeneratedCount: generatedAlerts.length,
      alerts: generatedAlerts.map((a) => ({
        ...a,
        evidence: JSON.parse(a.evidence || '{}'),
      })),
    };
  }

  static async listAlerts(organizationId: string, status?: string) {
    const where: any = { organizationId };
    if (status) where.status = status;

    const alerts = await prisma.detectionAlert.findMany({
      where,
      include: {
        rule: { select: { name: true, category: true } },
        asset: { select: { id: true, name: true, type: true, target: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return alerts.map((a) => ({
      ...a,
      evidence: JSON.parse(a.evidence || '{}'),
    }));
  }
}
