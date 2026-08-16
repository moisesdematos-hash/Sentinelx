import { Response, NextFunction } from 'express';
import { ComplianceService } from '../services/compliance.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class ComplianceController {
  static async runAudit(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const reports = await ComplianceService.runAudit(req.tenantId!, req.user?.id);
      return sendSuccess(res, reports, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getFrameworks(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const frameworks = await ComplianceService.getFrameworks(req.tenantId!);
      return sendSuccess(res, frameworks);
    } catch (err) {
      next(err);
    }
  }

  static async listControls(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const framework = req.query.framework as string;
      const controls = await ComplianceService.listControls(req.tenantId!, framework);
      return sendSuccess(res, controls);
    } catch (err) {
      next(err);
    }
  }

  static async exportAuditReport(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const exportData = await ComplianceService.exportAuditReport(req.tenantId!);
      return sendSuccess(res, exportData);
    } catch (err) {
      next(err);
    }
  }
}
