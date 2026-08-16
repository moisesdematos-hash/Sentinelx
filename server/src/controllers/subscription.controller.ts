import { Response, NextFunction } from 'express';
import { SubscriptionService, upgradeTierSchema } from '../services/subscription.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class SubscriptionController {
  static async getSubscription(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const sub = await SubscriptionService.getSubscription(req.tenantId!);
      return sendSuccess(res, sub);
    } catch (err) {
      next(err);
    }
  }

  static async upgradeTier(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = upgradeTierSchema.parse(req.body);
      const sub = await SubscriptionService.upgradeTier(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, sub);
    } catch (err) {
      next(err);
    }
  }

  static async listEntitlements(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const entitlements = await SubscriptionService.listEntitlements(req.tenantId!);
      return sendSuccess(res, entitlements);
    } catch (err) {
      next(err);
    }
  }
}
