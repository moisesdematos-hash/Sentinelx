import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';

export class FinOpsService {
  static async seedDefaultFinOps(organizationId: string) {
    const metric = await prisma.finOpsMetric.findFirst({ where: { organizationId } });
    if (!metric) {
      await prisma.finOpsMetric.create({
        data: {
          organizationId,
          monthlySecuritySpend: 4850.0,
          monthlyWastageEst: 1240.0,
          projectedSavings: 14880.0,
          roiPercentage: 340.0,
        },
      });
    }

    const count = await prisma.costSavingRecommendation.count({ where: { organizationId } });
    if (count === 0) {
      await prisma.costSavingRecommendation.createMany({
        data: [
          {
            organizationId,
            title: 'Delete Unattached EBS Storage Volume (vol-089a8b12)',
            provider: 'AWS',
            resourceId: 'vol-089a8b12',
            actionType: 'DELETE_UNATTACHED_EBS',
            monthlySavingsEst: 180.0,
            status: 'PENDING',
          },
          {
            organizationId,
            title: 'Terminate Idle EC2 Staging Instance (i-02941aa892)',
            provider: 'AWS',
            resourceId: 'i-02941aa892',
            actionType: 'TERMINATE_IDLE_EC2',
            monthlySavingsEst: 420.0,
            status: 'PENDING',
          },
          {
            organizationId,
            title: 'Rightsize Orphan Azure NAT Gateway (nat-09a288b)',
            provider: 'AZURE',
            resourceId: 'nat-09a288b',
            actionType: 'RIGHTSIZE_NAT_GATEWAY',
            monthlySavingsEst: 640.0,
            status: 'PENDING',
          },
        ],
      });
    }
  }

  static async getMetrics(organizationId: string) {
    await this.seedDefaultFinOps(organizationId);

    const metric = await prisma.finOpsMetric.findFirst({
      where: { organizationId },
    });

    return (
      metric || {
        monthlySecuritySpend: 4850.0,
        monthlyWastageEst: 1240.0,
        projectedSavings: 14880.0,
        roiPercentage: 340.0,
      }
    );
  }

  static async listRecommendations(organizationId: string) {
    await this.seedDefaultFinOps(organizationId);

    return prisma.costSavingRecommendation.findMany({
      where: { organizationId },
      orderBy: { monthlySavingsEst: 'desc' },
    });
  }

  static async applyRecommendation(
    organizationId: string,
    recommendationId: string,
    userId?: string
  ) {
    const rec = await prisma.costSavingRecommendation.findFirst({
      where: { id: recommendationId, organizationId },
    });

    if (!rec) {
      throw new AppError(404, 'Cost saving recommendation not found', 'NOT_FOUND');
    }

    const updatedRec = await prisma.costSavingRecommendation.update({
      where: { id: rec.id },
      data: {
        status: 'APPLIED',
        appliedAt: new Date(),
      },
    });

    const metric = await prisma.finOpsMetric.findFirst({ where: { organizationId } });
    if (metric) {
      const newWastage = Math.max(0, metric.monthlyWastageEst - rec.monthlySavingsEst);
      await prisma.finOpsMetric.update({
        where: { id: metric.id },
        data: {
          monthlyWastageEst: newWastage,
          projectedSavings: metric.projectedSavings + rec.monthlySavingsEst * 12,
          lastAnalyzedAt: new Date(),
        },
      });
    }

    await WebhookService.dispatchEvent(organizationId, 'FinOpsCostSavingIdentified', {
      recommendationId: updatedRec.id,
      title: updatedRec.title,
      actionType: updatedRec.actionType,
      monthlySavingsEst: updatedRec.monthlySavingsEst,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'FINOPS_COST_REDUCTION_APPLIED',
      resource: 'CostSavingRecommendation',
      resourceId: updatedRec.id,
      details: { title: updatedRec.title, monthlySavingsEst: updatedRec.monthlySavingsEst },
    });

    return updatedRec;
  }

  static async analyzeCloudWastage(organizationId: string, userId?: string) {
    await this.seedDefaultFinOps(organizationId);

    const metric = await prisma.finOpsMetric.findFirst({ where: { organizationId } });
    if (metric) {
      await prisma.finOpsMetric.update({
        where: { id: metric.id },
        data: { lastAnalyzedAt: new Date() },
      });
    }

    await AuditService.record({
      organizationId,
      userId,
      action: 'CLOUD_WASTAGE_ANALYSIS_EXECUTED',
      resource: 'FinOpsEngine',
      details: { timestamp: new Date().toISOString() },
    });

    return this.getMetrics(organizationId);
  }
}
