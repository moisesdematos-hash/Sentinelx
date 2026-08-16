import { Response, NextFunction } from 'express';
import { SiemService, createSiemIntegrationSchema } from '../services/siem.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class SiemController {
  static async listIntegrations(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const integrations = await SiemService.listIntegrations(req.tenantId!);
      return sendSuccess(res, integrations);
    } catch (err) {
      next(err);
    }
  }

  static async createIntegration(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createSiemIntegrationSchema.parse(req.body);
      const siem = await SiemService.createIntegration(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, siem, 201);
    } catch (err) {
      next(err);
    }
  }

  static async testDispatch(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const log = await SiemService.testDispatch(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, log, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getDeliveryLogs(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const logs = await SiemService.getDeliveryLogs(req.tenantId!);
      return sendSuccess(res, logs);
    } catch (err) {
      next(err);
    }
  }
}
