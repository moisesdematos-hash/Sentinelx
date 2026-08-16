import { Response, NextFunction } from 'express';
import { DetectionService, createDetectionRuleSchema } from '../services/detection.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class DetectionController {
  static async createRule(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createDetectionRuleSchema.parse(req.body);
      const rule = await DetectionService.createRule(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, rule, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listRules(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const rules = await DetectionService.listRules(req.tenantId!);
      return sendSuccess(res, rules);
    } catch (err) {
      next(err);
    }
  }

  static async evaluateEvents(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const result = await DetectionService.evaluateEvents(req.tenantId!, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listAlerts(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const status = req.query.status as string;
      const alerts = await DetectionService.listAlerts(req.tenantId!, status);
      return sendSuccess(res, alerts);
    } catch (err) {
      next(err);
    }
  }
}
