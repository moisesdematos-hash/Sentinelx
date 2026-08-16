import { Response, NextFunction } from 'express';
import { RiskEngineService } from '../services/risk_engine.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class RiskController {
  static async calculateRisk(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const result = await RiskEngineService.calculateRiskProfile(req.tenantId!, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getPriorityMatrix(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const matrix = await RiskEngineService.getPriorityMatrix(req.tenantId!);
      return sendSuccess(res, matrix);
    } catch (err) {
      next(err);
    }
  }
}
