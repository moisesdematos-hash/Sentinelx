import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createIncidentSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).default('HIGH'),
  assetId: z.string().optional(),
  assignee: z.string().default('Unassigned'),
});

export const updateIncidentSchema = z.object({
  status: z.enum(['OPEN', 'TRIAGED', 'IN_CONTAINMENT', 'RESOLVED', 'CLOSED']).optional(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  assignee: z.string().optional(),
});

export class IncidentService {
  static calculateSla(severity: string): Date {
    const now = new Date();
    if (severity === 'CRITICAL') return new Date(now.getTime() + 15 * 60 * 1000); // 15 mins
    if (severity === 'HIGH') return new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
    if (severity === 'MEDIUM') return new Date(now.getTime() + 4 * 60 * 60 * 1000); // 4 hours
    return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
  }

  static async seedDefaultIncidents(organizationId: string) {
    const count = await prisma.incident.count({ where: { organizationId } });
    if (count > 0) return;

    const assets = await prisma.asset.findMany({ where: { organizationId }, take: 1 });
    const assetId = assets.length > 0 ? assets[0].id : undefined;

    const inc = await prisma.incident.create({
      data: {
        organizationId,
        assetId,
        title: '[P0 INCIDENT] Suspected XZ Utils Backdoor RCE Attempt',
        description: 'Automated correlation engine flagged unauthorized remote code execution pattern on production server.',
        severity: 'CRITICAL',
        status: 'IN_CONTAINMENT',
        assignee: 'SOC Lead Analyst',
        slaExpiresAt: this.calculateSla('CRITICAL'),
      },
    });

    await prisma.incidentTimeline.createMany({
      data: [
        {
          incidentId: inc.id,
          author: 'SENTINELX Autopilot',
          actionType: 'STATUS_CHANGE',
          content: 'Incident automatically opened from P0 correlation alert.',
        },
        {
          incidentId: inc.id,
          author: 'SOC Lead Analyst',
          actionType: 'CONTAINMENT_ACTION',
          content: 'Isolated target server network interface to mitigate lateral spread.',
        },
      ],
    });
  }

  static async createIncident(
    organizationId: string,
    data: z.infer<typeof createIncidentSchema>,
    userId?: string
  ) {
    const slaExpiresAt = this.calculateSla(data.severity);

    const incident = await prisma.incident.create({
      data: {
        organizationId,
        assetId: data.assetId,
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: 'OPEN',
        assignee: data.assignee,
        slaExpiresAt,
      },
    });

    await prisma.incidentTimeline.create({
      data: {
        incidentId: incident.id,
        author: userId ? 'Security Analyst' : 'SENTINELX Autopilot',
        actionType: 'STATUS_CHANGE',
        content: `Incident case created with status OPEN and severity ${data.severity}.`,
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'CriticalIncidentDetected', {
      incidentId: incident.id,
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'INCIDENT_CREATED',
      resource: 'Incident',
      resourceId: incident.id,
      details: { title: incident.title, severity: incident.severity },
    });

    return incident;
  }

  static async listIncidents(
    organizationId: string,
    filters?: { status?: string; severity?: string; assignee?: string }
  ) {
    await this.seedDefaultIncidents(organizationId);

    const where: any = { organizationId };
    if (filters?.status) where.status = filters.status;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.assignee) where.assignee = filters.assignee;

    return prisma.incident.findMany({
      where,
      include: {
        asset: { select: { id: true, name: true, target: true } },
        timeline: { orderBy: { timestamp: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateIncident(
    organizationId: string,
    incidentId: string,
    data: z.infer<typeof updateIncidentSchema>,
    userId?: string
  ) {
    const existing = await prisma.incident.findFirst({
      where: { id: incidentId, organizationId },
    });

    if (!existing) {
      throw new AppError(404, 'Incident case not found', 'NOT_FOUND');
    }

    const isResolving = data.status === 'RESOLVED' || data.status === 'CLOSED';
    const updated = await prisma.incident.update({
      where: { id: existing.id },
      data: {
        status: data.status ?? existing.status,
        severity: data.severity ?? existing.severity,
        assignee: data.assignee ?? existing.assignee,
        resolvedAt: isResolving ? new Date() : existing.resolvedAt,
      },
    });

    if (data.status && data.status !== existing.status) {
      await prisma.incidentTimeline.create({
        data: {
          incidentId: updated.id,
          author: userId ? 'Security Analyst' : 'SENTINELX Autopilot',
          actionType: 'STATUS_CHANGE',
          content: `Incident status updated from ${existing.status} to ${data.status}.`,
        },
      });
    }

    if (isResolving) {
      await WebhookService.dispatchEvent(organizationId, 'ThreatResolved', {
        incidentId: updated.id,
        title: updated.title,
        status: updated.status,
      });
    }

    await AuditService.record({
      organizationId,
      userId,
      action: 'INCIDENT_UPDATED',
      resource: 'Incident',
      resourceId: updated.id,
      details: { previousStatus: existing.status, newStatus: updated.status },
    });

    return updated;
  }

  static async addTimelineNote(
    organizationId: string,
    incidentId: string,
    content: string,
    actionType: string = 'ANALYST_NOTE',
    userId?: string
  ) {
    const incident = await prisma.incident.findFirst({
      where: { id: incidentId, organizationId },
    });

    if (!incident) {
      throw new AppError(404, 'Incident case not found', 'NOT_FOUND');
    }

    const note = await prisma.incidentTimeline.create({
      data: {
        incidentId: incident.id,
        author: userId ? 'Security Analyst' : 'SENTINELX Autopilot',
        actionType,
        content,
      },
    });

    return note;
  }

  static async getIncidentTimeline(organizationId: string, incidentId: string) {
    const incident = await prisma.incident.findFirst({
      where: { id: incidentId, organizationId },
    });

    if (!incident) {
      throw new AppError(404, 'Incident case not found', 'NOT_FOUND');
    }

    return prisma.incidentTimeline.findMany({
      where: { incidentId: incident.id },
      orderBy: { timestamp: 'asc' },
    });
  }
}
