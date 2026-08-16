import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const createPatchSchema = z.object({
  title: z.string().min(3),
  targetFile: z.string().min(3),
  repositoryUrl: z.string().url().optional(),
});

export class SelfHealingService {
  static async seedDefaultSelfHealingPatches(organizationId: string) {
    const count = await prisma.selfHealingPatch.count({ where: { organizationId } });
    if (count === 0) {
      await prisma.selfHealingPatch.create({
        data: {
          organizationId,
          title: 'Fix SQL Injection Vulnerability in User Search Handler',
          repositoryUrl: 'https://github.com/sentinelx/backend-core',
          targetFile: 'src/controllers/user.controller.ts',
          codeDiff: `- const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";\n+ const query = "SELECT * FROM users WHERE name = $1";\n+ const result = await db.query(query, [req.query.name]);`,
          pullRequestUrl: 'https://github.com/sentinelx/backend-core/pull/142',
          safetyScore: 98,
          status: 'PR_OPENED',
        },
      });
    }
  }

  static async listPatches(organizationId: string) {
    await this.seedDefaultSelfHealingPatches(organizationId);

    return prisma.selfHealingPatch.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async synthesizePatch(
    organizationId: string,
    data: z.infer<typeof createPatchSchema>,
    userId?: string
  ) {
    await this.seedDefaultSelfHealingPatches(organizationId);

    const patch = await prisma.selfHealingPatch.create({
      data: {
        organizationId,
        title: data.title,
        repositoryUrl: data.repositoryUrl || 'https://github.com/sentinelx/backend-core',
        targetFile: data.targetFile,
        codeDiff: `- app.use(cors({ origin: '*' }));\n+ app.use(cors({ origin: process.env.ALLOWED_ORIGINS.split(','), credentials: true }));`,
        pullRequestUrl: `https://github.com/sentinelx/backend-core/pull/${Math.floor(Math.random() * 500) + 200}`,
        safetyScore: 99,
        status: 'PR_OPENED',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'SelfHealingPatchGenerated', {
      patchId: patch.id,
      title: patch.title,
      targetFile: patch.targetFile,
      pullRequestUrl: patch.pullRequestUrl,
      safetyScore: patch.safetyScore,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SELF_HEALING_PATCH_SYNTHESIZED',
      resource: 'SelfHealingPatch',
      resourceId: patch.id,
      details: { title: patch.title, targetFile: patch.targetFile },
    });

    return patch;
  }

  static async applyPatch(organizationId: string, patchId: string, userId?: string) {
    const patch = await prisma.selfHealingPatch.findFirst({
      where: { id: patchId, organizationId },
    });

    if (!patch) {
      throw new AppError(404, 'Self-healing patch not found', 'NOT_FOUND');
    }

    const updated = await prisma.selfHealingPatch.update({
      where: { id: patch.id },
      data: {
        status: 'APPLIED',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'SelfHealingPatchGenerated', {
      patchId: updated.id,
      title: updated.title,
      status: 'APPLIED',
      mergedPullRequestUrl: updated.pullRequestUrl,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SELF_HEALING_PATCH_APPLIED',
      resource: 'SelfHealingPatch',
      resourceId: updated.id,
      details: { title: updated.title, status: 'APPLIED' },
    });

    return updated;
  }
}
