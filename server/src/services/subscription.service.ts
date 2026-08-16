import { prisma } from '../db/client.js';
import { AppError } from '../middleware/error.middleware.js';
import { AuditService } from './audit.service.js';
import { WebhookService } from './webhook.service.js';
import { z } from 'zod';

export const upgradeTierSchema = z.object({
  planTier: z.enum(['COMMUNITY', 'PROFESSIONAL', 'ENTERPRISE', 'MSSP_PARTNER']),
});

export class SubscriptionService {
  static async seedDefaultSubscriptions(organizationId: string) {
    const sub = await prisma.subscriptionTier.findFirst({ where: { organizationId } });
    if (!sub) {
      const renew = new Date();
      renew.setMonth(renew.getMonth() + 1);

      await prisma.subscriptionTier.create({
        data: {
          organizationId,
          planTier: 'ENTERPRISE',
          status: 'ACTIVE',
          monthlyPrice: 1999.0,
          maxAssets: 500,
          maxScansPerMonth: 10000,
          currentAssetsCount: 42,
          currentScansCount: 1280,
          renewalDate: renew,
        },
      });
    }

    const count = await prisma.marketplaceEntitlement.count({ where: { organizationId } });
    if (count === 0) {
      await prisma.marketplaceEntitlement.createMany({
        data: [
          {
            organizationId,
            marketplace: 'AWS_MARKETPLACE',
            customerIdentifier: 'AWS-CUST-90182-ENT',
            productCode: 'sentinelx-ent-saas',
            dimension: 'monitored_nodes',
            quantity: 500,
            status: 'ACTIVE',
          },
          {
            organizationId,
            marketplace: 'AZURE_MARKETPLACE',
            customerIdentifier: 'AZURE-TENANT-4412-ENT',
            productCode: 'sentinelx-ent-azure',
            dimension: 'monitored_nodes',
            quantity: 250,
            status: 'ACTIVE',
          },
        ],
      });
    }
  }

  static async getSubscription(organizationId: string) {
    await this.seedDefaultSubscriptions(organizationId);

    const sub = await prisma.subscriptionTier.findFirst({
      where: { organizationId },
    });

    return sub;
  }

  static async upgradeTier(
    organizationId: string,
    data: z.infer<typeof upgradeTierSchema>,
    userId?: string
  ) {
    await this.seedDefaultSubscriptions(organizationId);

    const sub = await prisma.subscriptionTier.findFirst({ where: { organizationId } });
    if (!sub) {
      throw new AppError(404, 'Subscription record not found', 'NOT_FOUND');
    }

    const tierConfigs = {
      COMMUNITY: { monthlyPrice: 0.0, maxAssets: 10, maxScansPerMonth: 100 },
      PROFESSIONAL: { monthlyPrice: 499.0, maxAssets: 100, maxScansPerMonth: 2500 },
      ENTERPRISE: { monthlyPrice: 1999.0, maxAssets: 500, maxScansPerMonth: 10000 },
      MSSP_PARTNER: { monthlyPrice: 4999.0, maxAssets: 5000, maxScansPerMonth: 100000 },
    };

    const config = tierConfigs[data.planTier];

    const updated = await prisma.subscriptionTier.update({
      where: { id: sub.id },
      data: {
        planTier: data.planTier,
        monthlyPrice: config.monthlyPrice,
        maxAssets: config.maxAssets,
        maxScansPerMonth: config.maxScansPerMonth,
        status: 'ACTIVE',
      },
    });

    await WebhookService.dispatchEvent(organizationId, 'SubscriptionTierChanged', {
      subscriptionId: updated.id,
      newPlanTier: updated.planTier,
      maxAssets: updated.maxAssets,
      monthlyPrice: updated.monthlyPrice,
    });

    await AuditService.record({
      organizationId,
      userId,
      action: 'SUBSCRIPTION_TIER_UPGRADED',
      resource: 'SubscriptionTier',
      resourceId: updated.id,
      details: { newPlanTier: updated.planTier, monthlyPrice: updated.monthlyPrice },
    });

    return updated;
  }

  static async listEntitlements(organizationId: string) {
    await this.seedDefaultSubscriptions(organizationId);

    return prisma.marketplaceEntitlement.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
