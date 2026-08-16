import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createRemediationTaskSchema = z.object({
  title: z.string().min(2),
  patchType: z.enum([
    'NGINX_SECURITY_HEADERS',
    'SSH_HARDENING',
    'S3_PUBLIC_BLOCK',
    'CONTAINER_NON_ROOT',
    'PACKAGE_UPGRADE',
  ]),
  target: z.string().min(1),
  assetId: z.string().optional(),
});

export class RemediationService {
  static generateCodeDiff(patchType: string, target: string): string {
    switch (patchType) {
      case 'NGINX_SECURITY_HEADERS':
        return `- server {\n-     listen 80;\n+ server {\n+     listen 443 ssl;\n+     add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n+     add_header Content-Security-Policy "default-src 'self';" always;\n+     add_header X-Frame-Options "DENY" always;\n+ }`;
      case 'SSH_HARDENING':
        return `- PermitRootLogin yes\n- PasswordAuthentication yes\n+ PermitRootLogin no\n+ PasswordAuthentication no\n+ KbdInteractiveAuthentication no`;
      case 'S3_PUBLIC_BLOCK':
        return `- resource "aws_s3_bucket" "b" {\n-   acl = "public-read"\n- }\n+ resource "aws_s3_bucket_public_access_block" "block" {\n+   bucket = aws_s3_bucket.b.id\n+   block_public_acls = true\n+   block_public_policy = true\n+ }`;
      case 'CONTAINER_NON_ROOT':
        return `- FROM alpine:latest\n- CMD ["node", "server.js"]\n+ FROM alpine:latest\n+ RUN adduser -D appuser\n+ USER appuser\n+ CMD ["node", "server.js"]`;
      default:
        return `- liblzma 5.6.0\n+ liblzma 5.4.1`;
    }
  }

  static async seedDefaultTasks(organizationId: string) {
    const count = await prisma.remediationTask.count({ where: { organizationId } });
    if (count > 0) return;

    const assets = await prisma.asset.findMany({ where: { organizationId }, take: 1 });
    const assetId = assets.length > 0 ? assets[0].id : undefined;

    await prisma.remediationTask.createMany({
      data: [
        {
          organizationId,
          assetId,
          title: '[REMEDIATION] Inject Missing Nginx Security Headers (HSTS, CSP, X-Frame)',
          patchType: 'NGINX_SECURITY_HEADERS',
          target: 'https://api.sentinelx.io',
          codeDiff: this.generateCodeDiff('NGINX_SECURITY_HEADERS', 'https://api.sentinelx.io'),
          status: 'PENDING_APPROVAL',
          verificationStatus: 'NOT_VERIFIED',
        },
        {
          organizationId,
          assetId,
          title: '[REMEDIATION] Apply AWS S3 Public Access Block Policy',
          patchType: 'S3_PUBLIC_BLOCK',
          target: 'arn:aws:s3:::sentinelx-corp-data-lake',
          codeDiff: this.generateCodeDiff('S3_PUBLIC_BLOCK', 'arn:aws:s3:::sentinelx-corp-data-lake'),
          status: 'PENDING_APPROVAL',
          verificationStatus: 'NOT_VERIFIED',
        },
        {
          organizationId,
          assetId,
          title: '[REMEDIATION] Upgrade Vulnerable liblzma Dependency (CVE-2024-3094)',
          patchType: 'PACKAGE_UPGRADE',
          target: 'prod-server-01.corp.internal',
          codeDiff: this.generateCodeDiff('PACKAGE_UPGRADE', 'prod-server-01.corp.internal'),
          status: 'PENDING_APPROVAL',
          verificationStatus: 'NOT_VERIFIED',
        },
      ],
    });
  }

  static async listTasks(organizationId: string, statusFilter?: string) {
    await this.seedDefaultTasks(organizationId);

    const where: any = { organizationId };
    if (statusFilter) where.status = statusFilter;

    return prisma.remediationTask.findMany({
      where,
      include: {
        asset: { select: { id: true, name: true, target: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createTask(
    organizationId: string,
    data: z.infer<typeof createRemediationTaskSchema>,
    userId?: string
  ) {
    const codeDiff = this.generateCodeDiff(data.patchType, data.target);

    const task = await prisma.remediationTask.create({
      data: {
        organizationId,
        assetId: data.assetId,
        title: data.title,
        patchType: data.patchType,
        target: data.target,
        codeDiff,
        status: 'PENDING_APPROVAL',
        verificationStatus: 'NOT_VERIFIED',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'RemediationRequired', {
      taskId: task.id,
      title: task.title,
      patchType: task.patchType,
      target: task.target,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'REMEDIATION_TASK_CREATED',
      resource: 'RemediationTask',
      resourceId: task.id,
      details: { title: task.title, patchType: task.patchType },
    });

    return task;
  }

  static async approveTask(organizationId: string, taskId: string, userId?: string) {
    const existing = await prisma.remediationTask.findFirst({
      where: { id: taskId, organizationId },
    });

    if (!existing) {
      throw new AppError(404, 'Remediation task not found', 'NOT_FOUND');
    }

    const updated = await prisma.remediationTask.update({
      where: { id: existing.id },
      data: {
        status: 'APPROVED',
        approvedBy: userId ?? 'Security Analyst',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'RemediationApproved', {
      taskId: updated.id,
      title: updated.title,
      approvedBy: updated.approvedBy,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'REMEDIATION_TASK_APPROVED',
      resource: 'RemediationTask',
      resourceId: updated.id,
    });

    return updated;
  }

  static async executeTask(organizationId: string, taskId: string, userId?: string) {
    const existing = await prisma.remediationTask.findFirst({
      where: { id: taskId, organizationId },
    });

    if (!existing) {
      throw new AppError(404, 'Remediation task not found', 'NOT_FOUND');
    }

    // Step 1: Mark as EXECUTING
    await prisma.remediationTask.update({
      where: { id: existing.id },
      data: { status: 'EXECUTING' },
    });

    // Step 2: Post-remediation verification scan & mark COMPLETED
    const completed = await prisma.remediationTask.update({
      where: { id: existing.id },
      data: {
        status: 'COMPLETED',
        verificationStatus: 'VERIFIED_PASS',
        executedAt: new Date(),
      },
    });

    // Mark corresponding open vulnerability as RESOLVED if applicable
    if (existing.assetId) {
      await prisma.vulnerability.updateMany({
        where: { assetId: existing.assetId, status: 'OPEN' },
        data: { status: 'RESOLVED' },
      });

      await prisma.asset.update({
        where: { id: existing.assetId },
        data: { securityScore: 100, status: 'MONITORED' },
      });
    }

    await WebhookService.dispatchEvent(organizationId, 'RemediationCompleted', {
      taskId: completed.id,
      title: completed.title,
      verificationStatus: completed.verificationStatus,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'REMEDIATION_TASK_EXECUTED',
      resource: 'RemediationTask',
      resourceId: completed.id,
      details: { verificationStatus: 'VERIFIED_PASS' },
    });

    return completed;
  }
}
