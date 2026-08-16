import { Response, NextFunction } from 'express';
import { BrandProtectionService } from '../services/brand_protection.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class BrandProtectionController {
  static async listDomains(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const domains = await BrandProtectionService.listDomains(req.tenantId!);
      return sendSuccess(res, domains);
    } catch (err) {
      next(err);
    }
  }

  static async scanImpersonation(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const targetDomain = req.body.targetDomain as string;
      const domains = await BrandProtectionService.scanImpersonation(
        req.tenantId!,
        targetDomain,
        req.user?.id
      );
      return sendSuccess(res, domains);
    } catch (err) {
      next(err);
    }
  }

  static async submitTakedown(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const domain = await BrandProtectionService.submitTakedown(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, domain);
    } catch (err) {
      next(err);
    }
  }

  static async listLeaks(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const leaks = await BrandProtectionService.listLeaks(req.tenantId!);
      return sendSuccess(res, leaks);
    } catch (err) {
      next(err);
    }
  }
}
