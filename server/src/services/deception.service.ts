import crypto from 'crypto';
import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createDeceptionDecoySchema = z.object({
  name: z.string().min(2),
  type: z.enum([
    'HONEYPOT_SSH',
    'HONEYPOT_DATABASE',
    'HONEYTOKEN_AWS_KEY',
    'HONEYTOKEN_WEB_COOKIE',
  ]),
  target: z.string().min(1),
});

export class DeceptionService {
  static generateHoneytoken(type: string): string {
    if (type === 'HONEYTOKEN_AWS_KEY') {
      return `AKIA${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    }
    return `ht_${crypto.randomBytes(16).toString('hex')}`;
  }

  static async seedDefaultDecoys(organizationId: string) {
    const count = await prisma.deceptionDecoy.count({ where: { organizationId } });
    if (count > 0) return;

    await prisma.deceptionDecoy.createMany({
      data: [
        {
          organizationId,
          name: 'Honeytoken AWS Admin Key (Decoy Credentials)',
          type: 'HONEYTOKEN_AWS_KEY',
          target: 'AWS IAM Credentials Store',
          tokenValue: 'AKIA9928172635418290',
          status: 'DEPLOYED',
        },
        {
          organizationId,
          name: 'Decoy SSH DMZ Gateway Bastion',
          type: 'HONEYPOT_SSH',
          target: 'ssh-gateway-decoy.corp.internal:22',
          status: 'DEPLOYED',
        },
        {
          organizationId,
          name: 'Decoy Customer Database Instance',
          type: 'HONEYPOT_DATABASE',
          target: 'postgres-decoy.corp.internal:5432',
          status: 'DEPLOYED',
        },
        {
          organizationId,
          name: 'Decoy Admin Session Cookie Honeytoken',
          type: 'HONEYTOKEN_WEB_COOKIE',
          target: 'https://api.sentinelx.io/auth/session',
          tokenValue: 'ht_cookie_admin_session_token_decoy_9921',
          status: 'DEPLOYED',
        },
      ],
    });
  }

  static async listDecoys(organizationId: string) {
    await this.seedDefaultDecoys(organizationId);

    return prisma.deceptionDecoy.findMany({
      where: { organizationId },
      include: {
        interactions: {
          take: 5,
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createDecoy(
    organizationId: string,
    data: z.infer<typeof createDeceptionDecoySchema>,
    userId?: string
  ) {
    const tokenValue =
      data.type.startsWith('HONEYTOKEN') ? this.generateHoneytoken(data.type) : undefined;

    const decoy = await prisma.deceptionDecoy.create({
      data: {
        organizationId,
        name: data.name,
        type: data.type,
        target: data.target,
        tokenValue,
        status: 'DEPLOYED',
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'DECEPTION_DECOY_DEPLOYED',
      resource: 'DeceptionDecoy',
      resourceId: decoy.id,
      details: { name: decoy.name, type: decoy.type },
    });

    return decoy;
  }

  static async simulateIntrusion(
    organizationId: string,
    decoyId: string,
    attackerIp: string,
    userAgent?: string,
    commandsAttempted?: string[],
    userId?: string
  ) {
    const decoy = await prisma.deceptionDecoy.findFirst({
      where: { id: decoyId, organizationId },
    });

    if (!decoy) {
      throw new AppError(404, 'Deception decoy not found', 'NOT_FOUND');
    }

    const payload = JSON.stringify({
      decoyType: decoy.type,
      target: decoy.target,
      tokenValue: decoy.tokenValue,
      capturedAt: new Date().toISOString(),
      rawDump: `[HONEYPOT ALERT] Attacker ${attackerIp} interacted with decoy ${decoy.name}`,
    });

    const cmds = commandsAttempted || [
      'cat /etc/passwd',
      'curl http://169.254.169.254/latest/meta-data/',
      'uname -a',
    ];

    const interaction = await prisma.deceptionInteraction.create({
      data: {
        decoyId: decoy.id,
        attackerIp: attackerIp || '185.220.101.99',
        userAgent: userAgent || 'Mozilla/5.0 (Kali Linux x86_64; Nmap Scripting Engine)',
        payload,
        commandsAttempted: JSON.stringify(cmds),
        severity: 'CRITICAL',
        status: 'ALARM_ACTIVE',
      },
    });

    await prisma.deceptionDecoy.update({
      where: { id: decoy.id },
      data: {
        status: 'TRIGGERED',
        interactionsCount: decoy.interactionsCount + 1,
        lastInteractedAt: new Date(),
      },
    });

    // Auto-create Critical Incident case
    await prisma.incident.create({
      data: {
        organizationId,
        title: `[DECEPTION ALARM] Attacker Intrusion on Decoy: ${decoy.name}`,
        description: `Zero-false-positive honeypot breach by IP ${attackerIp}. Commands attempted: ${cmds.join(', ')}`,
        severity: 'CRITICAL',
        status: 'OPEN',
        assignee: 'SENTINELX Autopilot',
        slaExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15m SLA
      },
    });

    // Trigger Autopilot IP isolation action
    await prisma.autopilotAction.create({
      data: {
        organizationId,
        actionType: 'NETWORK_ISOLATION',
        targetResource: attackerIp,
        executionMode: 'FULL_AUTO',
        status: 'EXECUTED',
        details: JSON.stringify({ decoyId: decoy.id, triggerReason: 'Honeypot Breach' }),
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'DeceptionTriggered', {
      interactionId: interaction.id,
      decoyName: decoy.name,
      decoyType: decoy.type,
      attackerIp: interaction.attackerIp,
      severity: 'CRITICAL',
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'HONEYPOT_INTRUSION_DETECTED',
      resource: 'DeceptionInteraction',
      resourceId: interaction.id,
      details: { attackerIp: interaction.attackerIp, decoyType: decoy.type },
    });

    return interaction;
  }

  static async listInteractions(organizationId: string) {
    return prisma.deceptionInteraction.findMany({
      where: { decoy: { organizationId } },
      include: {
        decoy: { select: { name: true, type: true, target: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  static async containAttacker(organizationId: string, interactionId: string, userId?: string) {
    const interaction = await prisma.deceptionInteraction.findFirst({
      where: { id: interactionId, decoy: { organizationId } },
    });

    if (!interaction) {
      throw new AppError(404, 'Deception interaction not found', 'NOT_FOUND');
    }

    const updated = await prisma.deceptionInteraction.update({
      where: { id: interaction.id },
      data: { status: 'CONTAINED' },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'ATTACKER_IP_CONTAINED',
      resource: 'DeceptionInteraction',
      resourceId: updated.id,
      details: { attackerIp: updated.attackerIp },
    });

    return updated;
  }
}
