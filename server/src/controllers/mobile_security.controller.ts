import { Response, NextFunction } from 'express';
import { MobileSecurityService, runMobileScanSchema } from '../services/mobile_security.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class MobileSecurityController {
  static async listScans(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const scans = await MobileSecurityService.listScans(req.tenantId!);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }

  static async runMobileScan(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = runMobileScanSchema.parse(req.body);
      const scan = await MobileSecurityService.runMobileScan(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, scan, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getScanDetails(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const scan = await MobileSecurityService.getScanDetails(req.tenantId!, id);
      return sendSuccess(res, scan);
    } catch (err) {
      next(err);
    }
  }
}
