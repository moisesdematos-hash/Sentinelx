import { Response, NextFunction } from 'express';
import { RecoveryService, rollbackRequestSchema, restoreAssetSchema } from '../services/recovery.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class RecoveryController {
  static async listBaselines(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const baselines = await RecoveryService.listBaselines(req.tenantId!);
      return sendSuccess(res, baselines);
    } catch (err) {
      next(err);
    }
  }

  static async executeRollback(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = rollbackRequestSchema.parse(req.body);
      const record = await RecoveryService.executeRollback(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, record, 201);
    } catch (err) {
      next(err);
    }
  }

  static async restoreAsset(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = restoreAssetSchema.parse(req.body);
      const record = await RecoveryService.restoreAsset(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, record, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listRollbacks(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const rollbacks = await RecoveryService.listRollbacks(req.tenantId!);
      return sendSuccess(res, rollbacks);
    } catch (err) {
      next(err);
    }
  }
}
