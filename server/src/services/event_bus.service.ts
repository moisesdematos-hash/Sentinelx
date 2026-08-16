import EventEmitter from 'events';
import { Response } from 'express';
import { prisma } from '../db/client.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const publishSecurityEventSchema = z.object({
  eventType: z.string().min(2),
  sourceEngine: z.enum(['WEBSITE', 'SERVER', 'API', 'CONTAINER', 'CLOUD', 'VULNERABILITY', 'MONITORING']).default('MONITORING'),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']).default('INFO'),
  assetId: z.string().optional(),
  payload: z.record(z.any()).default({}),
});

class SecurityEventBusEmitter extends EventEmitter {}

export class EventBusService {
  private static emitter = new SecurityEventBusEmitter();

  static async publishEvent(
    organizationId: string,
    data: z.infer<typeof publishSecurityEventSchema>,
    userId?: string
  ) {
    const securityEvent = await prisma.securityEvent.create({
      data: {
        organizationId,
        assetId: data.assetId,
        eventType: data.eventType,
        sourceEngine: data.sourceEngine,
        severity: data.severity,
        payload: JSON.stringify(data.payload),
      },
    });

    const parsedEvent = {
      ...securityEvent,
      payload: JSON.parse(securityEvent.payload),
    };

    // Emit live SSE event to subscribers
    this.emitter.emit(`event:${organizationId}`, parsedEvent);

    // Forward to webhooks if eventType matches
    try {
      await WebhookService.dispatchEvent(organizationId, data.eventType as any, data.payload);
    } catch {
      // Non-blocking fallback
    }

    await AuditService.record({
      organizationId,
      userId,
      action: 'SECURITY_EVENT_PUBLISHED',
      resource: 'SecurityEvent',
      resourceId: securityEvent.id,
      details: { eventType: data.eventType, severity: data.severity, sourceEngine: data.sourceEngine },
    });

    return parsedEvent;
  }

  static async getEvents(
    organizationId: string,
    filters?: { sourceEngine?: string; severity?: string; assetId?: string; limit?: number }
  ) {
    const where: any = { organizationId };
    if (filters?.sourceEngine) where.sourceEngine = filters.sourceEngine;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.assetId) where.assetId = filters.assetId;

    const events = await prisma.securityEvent.findMany({
      where,
      include: {
        asset: { select: { id: true, name: true, type: true, target: true } },
      },
      orderBy: { timestamp: 'desc' },
      take: filters?.limit || 50,
    });

    return events.map((e) => ({
      ...e,
      payload: JSON.parse(e.payload || '{}'),
    }));
  }

  static subscribeToStream(organizationId: string, res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial handshake SSE ping
    res.write(`data: ${JSON.stringify({ type: 'HANDSHAKE', status: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    const listener = (event: any) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    this.emitter.on(`event:${organizationId}`, listener);

    res.on('close', () => {
      this.emitter.removeListener(`event:${organizationId}`, listener);
    });
  }
}
