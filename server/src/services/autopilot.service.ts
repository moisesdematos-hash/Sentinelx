import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createPolicySchema = z.object({
  name: z.string().min(2),
  triggerCondition: z.enum([
    'AUTO_CONTAIN_P0',
    'AUTO_REMEDIATE_EXPOSED_S3',
    'AUTO_ISOLATE_CONTAINER',
    'AUTO_REVOKE_WILDCARD_IAM',
  ]),
  actionType: z.enum([
    'NETWORK_ISOLATION',
    'S3_PUBLIC_BLOCK',
    'IAM_REVOKE',
    'CONTAINER_QUARANTINE',
  ]),
  executionMode: z.enum(['FULL_AUTO', 'SEMI_AUTO', 'DISABLED']).default('FULL_AUTO'),
  maxActionsPerHour: z.number().int().positive().default(5),
});

export class AutopilotService {
  static async seedDefaultPolicies(organizationId: string) {
    const count = await prisma.autopilotPolicy.count({ where: { organizationId } });
    if (count > 0) return;

    await prisma.autopilotPolicy.createMany({
      data: [
        {
          organizationId,
          name: '[AUTOPILOT] Auto-Contain P0 Immediate Risk Findings',
          triggerCondition: 'AUTO_CONTAIN_P0',
          actionType: 'NETWORK_ISOLATION',
          executionMode: 'FULL_AUTO',
          maxActionsPerHour: 5,
          status: 'ENABLED',
        },
        {
          organizationId,
          name: '[AUTOPILOT] Auto-Remediate Public Cloud S3 Buckets',
          triggerCondition: 'AUTO_REMEDIATE_EXPOSED_S3',
          actionType: 'S3_PUBLIC_BLOCK',
          executionMode: 'FULL_AUTO',
          maxActionsPerHour: 5,
          status: 'ENABLED',
        },
        {
          organizationId,
          name: '[AUTOPILOT] Auto-Quarantine Vulnerable Container Pods',
          triggerCondition: 'AUTO_ISOLATE_CONTAINER',
          actionType: 'CONTAINER_QUARANTINE',
          executionMode: 'SEMI_AUTO',
          maxActionsPerHour: 3,
          status: 'ENABLED',
        },
      ],
    });
  }

  static async listPolicies(organizationId: string) {
    await this.seedDefaultPolicies(organizationId);
    return prisma.autopilotPolicy.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createPolicy(
    organizationId: string,
    data: z.infer<typeof createPolicySchema>,
    userId?: string
  ) {
    const policy = await prisma.autopilotPolicy.create({
      data: {
        organizationId,
        name: data.name,
        triggerCondition: data.triggerCondition,
        actionType: data.actionType,
        executionMode: data.executionMode,
        maxActionsPerHour: data.maxActionsPerHour,
        status: 'ENABLED',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'AUTOPILOT_POLICY_CREATED',
      resource: 'AutopilotPolicy',
      resourceId: policy.id,
      details: { name: policy.name, mode: policy.executionMode },
    });

    return policy;
  }

  static async executeSelfDefense(organizationId: string, userId?: string) {
    await this.seedDefaultPolicies(organizationId);

    let policies = await prisma.autopilotPolicy.findMany({
      where: { organizationId },
    });

    if (policies.length === 0) {
      await this.seedDefaultPolicies(organizationId);
      policies = await prisma.autopilotPolicy.findMany({
        where: { organizationId },
      });
    }

    // Check rate limit safety guardrail: count actions in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentActionsCount = await prisma.autopilotAction.count({
      where: { organizationId, executedAt: { gte: oneHourAgo } },
    });

    const openAlerts = await prisma.detectionAlert.findMany({
      where: { organizationId, status: 'OPEN', severity: 'CRITICAL' },
      take: 2,
    });

    const executedActions = [];

    for (const policy of policies) {
      if (policy.executionMode === 'DISABLED' || policy.status === 'PAUSED') continue;

      // Enforce max actions per hour guardrail
      if (recentActionsCount >= policy.maxActionsPerHour) {
        const blockedAction = await prisma.autopilotAction.create({
          data: {
            organizationId,
            policyId: policy.id,
            actionType: policy.actionType,
            targetResource: 'RateLimitGuardrail',
            executionMode: policy.executionMode,
            status: 'BLOCKED_BY_GUARDRAIL',
            details: JSON.stringify({
              reason: `Rate limit threshold exceeded (${recentActionsCount}/${policy.maxActionsPerHour} per hour)`,
            }),
          },
        });
        executedActions.push(blockedAction);
        continue;
      }

      // Execute self-defense action based on policy trigger
      let targetResource = 'prod-k8s-pod-cluster-node-01';
      let status = policy.executionMode === 'FULL_AUTO' ? 'EXECUTED' : 'PENDING_APPROVAL';

      if (openAlerts.length > 0) {
        targetResource = openAlerts[0].title;
      }

      const actionRecord = await prisma.autopilotAction.create({
        data: {
          organizationId,
          policyId: policy.id,
          actionType: policy.actionType,
          targetResource,
          executionMode: policy.executionMode,
          status,
          details: JSON.stringify({
            trigger: policy.triggerCondition,
            mitigationStep: `Executed ${policy.actionType} on target ${targetResource}`,
            timestamp: new Date().toISOString(),
          }),
        },
      });

      executedActions.push(actionRecord);

      await WebhookService.dispatchEvent(organizationId, 'AutopilotActionExecuted', {
        actionId: actionRecord.id,
        actionType: actionRecord.actionType,
        targetResource: actionRecord.targetResource,
        status: actionRecord.status,
      });
    }

    await AuditService.record({
      organizationId,
      userId,
      action: 'AUTOPILOT_SELF_DEFENSE_EXECUTED',
      resource: 'AutopilotAction',
      details: { executedCount: executedActions.length },
    });

    return {
      evaluatedPoliciesCount: policies.length,
      actions: executedActions,
    };
  }

  static async listActions(organizationId: string) {
    return prisma.autopilotAction.findMany({
      where: { organizationId },
      include: {
        policy: { select: { name: true, triggerCondition: true } },
      },
      orderBy: { executedAt: 'desc' },
      take: 50,
    });
  }

  static async triggerEmergencyKillSwitch(organizationId: string, userId?: string) {
    await prisma.autopilotPolicy.updateMany({
      where: { organizationId },
      data: { status: 'PAUSED', executionMode: 'DISABLED' },
    });

    const killSwitchAction = await prisma.autopilotAction.create({
      data: {
        organizationId,
        actionType: 'EMERGENCY_KILL_SWITCH',
        targetResource: 'ALL_AUTOPILOT_POLICIES',
        executionMode: 'DISABLED',
        status: 'EXECUTED',
        details: JSON.stringify({ reason: 'Emergency Kill Switch engaged by Security Analyst' }),
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'AUTOPILOT_KILL_SWITCH_ENGAGED',
      resource: 'AutopilotPolicy',
      details: { status: 'PAUSED' },
    });

    return killSwitchAction;
  }
}
