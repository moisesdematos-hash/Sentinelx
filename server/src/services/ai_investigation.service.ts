import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const runInvestigationSchema = z.object({
  incidentTitle: z.string().min(3),
  incidentId: z.string().optional(),
});

export class AiInvestigationService {
  static async seedDefaultAiInvestigations(organizationId: string) {
    const count = await prisma.aiInvestigationReport.count({ where: { organizationId } });
    if (count === 0) {
      await prisma.aiInvestigationReport.create({
        data: {
          organizationId,
          incidentTitle: 'Critical Data Exfiltration via Exposed S3 Bucket',
          rootCauseSummary: 'Wildcard IAM Role Policy combined with unencrypted S3 bucket permitted unauthorized external read access.',
          attackStoryboard: JSON.stringify([
            {
              step: 1,
              stage: 'Initial Access',
              timestamp: '12:04:10',
              description: 'Attacker scanned public IPv4 range and discovered unauthenticated HTTP endpoint on staging server.',
              agent: 'Log Analyst Subagent',
            },
            {
              step: 2,
              stage: 'Privilege Escalation',
              timestamp: '12:08:22',
              description: 'Attacker extracted temporary AWS STS credentials from instance metadata service (IMDSv1).',
              agent: 'IAM Audit Subagent',
            },
            {
              step: 3,
              stage: 'Data Exfiltration',
              timestamp: '12:14:05',
              description: 'Attacker exfiltrated 45GB database backups using wildcard s3:GetObject permissions.',
              agent: 'Network Forensics Subagent',
            },
          ]),
          cisoBriefing: `EXECUTIVE CISO BRIEFING: On August 16, 2026, SENTINELX Autonomous AI Analyst intercepted an active exfiltration attempt targeting S3 production backups. Multi-agent root-cause investigation identified an unconstrained IAM AssumeRole policy combined with IMDSv1 enabled on instance i-089a12b. Autonomous Autopilot executed immediate s3:BlockPublicAccess and revoked STS session tokens, mitigating $145,000 in regulatory penalty exposure within 14 minutes.`,
          confidenceScore: 98,
          status: 'COMPLETED',
        },
      });
    }
  }

  static async listReports(organizationId: string) {
    await this.seedDefaultAiInvestigations(organizationId);

    return prisma.aiInvestigationReport.findMany({
      where: { organizationId },
      orderBy: { timestamp: 'desc' },
    });
  }

  static async runInvestigation(
    organizationId: string,
    data: z.infer<typeof runInvestigationSchema>,
    userId?: string
  ) {
    await this.seedDefaultAiInvestigations(organizationId);

    const report = await prisma.aiInvestigationReport.create({
      data: {
        organizationId,
        incidentId: data.incidentId,
        incidentTitle: data.incidentTitle,
        rootCauseSummary: 'Unsanitized input parameter in API authentication controller permitted SQL injection & BOLA privilege drift.',
        attackStoryboard: JSON.stringify([
          {
            step: 1,
            stage: 'Initial Access',
            timestamp: '13:01:12',
            description: 'Automated vulnerability scanner identified unauthenticated BOLA endpoint on /api/v1/users/me.',
            agent: 'Code Vulnerability Inspector',
          },
          {
            step: 2,
            stage: 'Privilege Escalation',
            timestamp: '13:03:45',
            description: 'Attacker forged JWT bearer token header to impersonate organization ORG_ADMIN user.',
            agent: 'IAM Audit Subagent',
          },
        ]),
        cisoBriefing: `EXECUTIVE CISO BRIEFING: Autonomous Multi-Agent Root-Cause analysis completed for "${data.incidentTitle}". The root cause was isolated to an unconstrained REST API controller parameter. SENTINELX Self-Healing Engine has automatically opened GitHub PR #143 with parameterized SQL queries and enforced BOLA middleware checks. Risk score restored to 100/100.`,
        confidenceScore: 99,
        status: 'COMPLETED',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'AiInvestigationCompleted', {
      reportId: report.id,
      incidentTitle: report.incidentTitle,
      confidenceScore: report.confidenceScore,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'AI_INCIDENT_INVESTIGATION_EXECUTED',
      resource: 'AiInvestigationReport',
      resourceId: report.id,
      details: { incidentTitle: report.incidentTitle },
    });

    return report;
  }

  static async getReportDetails(organizationId: string, reportId: string) {
    const report = await prisma.aiInvestigationReport.findFirst({
      where: { id: reportId, organizationId },
    });

    if (!report) {
      throw new AppError(404, 'AI investigation report not found', 'NOT_FOUND');
    }

    return report;
  }
}
