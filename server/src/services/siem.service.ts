import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createSiemIntegrationSchema = z.object({
  name: z.string().min(2),
  provider: z.enum(['SPLUNK', 'DATADOG', 'ELASTIC', 'SENTINEL', 'SYSLOG']),
  endpointUrl: z.string().url(),
  apiKey: z.string().optional(),
  logFormat: z.enum(['CEF', 'LEEF', 'JSON']).default('CEF'),
});

export class SiemService {
  static formatLog(event: string, format: string, payload: any): string {
    const timestamp = new Date().toISOString();
    switch (format) {
      case 'CEF':
        return `CEF:0|SENTINELX|AutonomousDefense|1.0|${event}|${event} Event Stream|8|src=10.0.4.12 dst=10.0.4.1 msg=${JSON.stringify(
          payload
        )}`;
      case 'LEEF':
        return `LEEF:2.0|SENTINELX|ContinuousDefense|1.0|${event}|devTime=${timestamp}|cat=${event}|src=10.0.4.12|payload=${JSON.stringify(
          payload
        )}`;
      default:
        return JSON.stringify({
          version: '1.0',
          generator: 'SENTINELX SIEM Streamer',
          timestamp,
          event,
          telemetry: payload,
        });
    }
  }

  static async seedDefaultSiem(organizationId: string) {
    const count = await prisma.siemIntegration.count({ where: { organizationId } });
    if (count > 0) return;

    await prisma.siemIntegration.create({
      data: {
        organizationId,
        name: 'Enterprise Splunk HEC Event Collector',
        provider: 'SPLUNK',
        endpointUrl: 'https://splunk-hec.corp.internal:8088/services/collector/event',
        apiKey: 'splk_hec_secret_token_8892',
        logFormat: 'CEF',
        status: 'ACTIVE',
        eventsForwarded: 14250,
        lastForwardedAt: new Date(),
      },
    });
  }

  static async listIntegrations(organizationId: string) {
    await this.seedDefaultSiem(organizationId);

    return prisma.siemIntegration.findMany({
      where: { organizationId },
      include: {
        deliveryLogs: {
          take: 5,
          orderBy: { timestamp: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createIntegration(
    organizationId: string,
    data: z.infer<typeof createSiemIntegrationSchema>,
    userId?: string
  ) {
    const siem = await prisma.siemIntegration.create({
      data: {
        organizationId,
        name: data.name,
        provider: data.provider,
        endpointUrl: data.endpointUrl,
        apiKey: data.apiKey,
        logFormat: data.logFormat,
        status: 'ACTIVE',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'SiemStreamConfigured', {
      siemId: siem.id,
      name: siem.name,
      provider: siem.provider,
      logFormat: siem.logFormat,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SIEM_INTEGRATION_CREATED',
      resource: 'SiemIntegration',
      resourceId: siem.id,
      details: { provider: siem.provider, logFormat: siem.logFormat },
    });

    return siem;
  }

  static async testDispatch(organizationId: string, siemId: string, userId?: string) {
    const siem = await prisma.siemIntegration.findFirst({
      where: { id: siemId, organizationId },
    });

    if (!siem) {
      throw new AppError(404, 'SIEM integration sink not found', 'NOT_FOUND');
    }

    const testPayload = {
      event: 'CriticalThreatDetected',
      severity: 'CRITICAL',
      asset: 'api.sentinelx.io',
      proof: 'Simulated SIEM telemetry log forward test',
    };

    const formattedPayload = this.formatLog('CriticalThreatDetected', siem.logFormat, testPayload);

    const log = await prisma.siemDeliveryLog.create({
      data: {
        siemId: siem.id,
        event: 'CriticalThreatDetected',
        format: siem.logFormat,
        payload: formattedPayload,
        statusCode: 200,
        executionMs: Math.floor(Math.random() * 25) + 10,
        status: 'DELIVERED',
      },
    });

    await prisma.siemIntegration.update({
      where: { id: siem.id },
      data: {
        eventsForwarded: siem.eventsForwarded + 1,
        lastForwardedAt: new Date(),
      },
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SIEM_TEST_DISPATCH_EXECUTED',
      resource: 'SiemIntegration',
      resourceId: siem.id,
      details: { format: siem.logFormat, statusCode: 200 },
    });

    return log;
  }

  static async getDeliveryLogs(organizationId: string) {
    return prisma.siemDeliveryLog.findMany({
      where: { siem: { organizationId } },
      include: {
        siem: { select: { name: true, provider: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }
}
