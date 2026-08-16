import { Response, NextFunction } from 'express';
import { AutopilotService, createPolicySchema } from '../services/autopilot.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class AutopilotController {
  static async listPolicies(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const policies = await AutopilotService.listPolicies(req.tenantId!);
      return sendSuccess(res, policies);
    } catch (err) {
      next(err);
    }
  }

  static async createPolicy(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createPolicySchema.parse(req.body);
      const policy = await AutopilotService.createPolicy(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, policy, 201);
    } catch (err) {
      next(err);
    }
  }

  static async executeSelfDefense(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const result = await AutopilotService.executeSelfDefense(req.tenantId!, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listActions(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const actions = await AutopilotService.listActions(req.tenantId!);
      return sendSuccess(res, actions);
    } catch (err) {
      next(err);
    }
  }

  static async triggerKillSwitch(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const action = await AutopilotService.triggerEmergencyKillSwitch(req.tenantId!, req.user?.id);
      return sendSuccess(res, action, 201);
    } catch (err) {
      next(err);
    }
  }
}
