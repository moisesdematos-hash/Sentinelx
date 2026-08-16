import { Response, NextFunction } from 'express';
import { FinOpsService } from '../services/finops.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class FinOpsController {
  static async getMetrics(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const metrics = await FinOpsService.getMetrics(req.tenantId!);
      return sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  }

  static async listRecommendations(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const recs = await FinOpsService.listRecommendations(req.tenantId!);
      return sendSuccess(res, recs);
    } catch (err) {
      next(err);
    }
  }

  static async applyRecommendation(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const rec = await FinOpsService.applyRecommendation(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, rec);
    } catch (err) {
      next(err);
    }
  }

  static async analyzeCloudWastage(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const metrics = await FinOpsService.analyzeCloudWastage(req.tenantId!, req.user?.id);
      return sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  }
}
