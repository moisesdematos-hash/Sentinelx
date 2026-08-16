import { Response, NextFunction } from 'express';
import { AiInvestigationService, runInvestigationSchema } from '../services/ai_investigation.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class AiInvestigationController {
  static async listReports(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const reports = await AiInvestigationService.listReports(req.tenantId!);
      return sendSuccess(res, reports);
    } catch (err) {
      next(err);
    }
  }

  static async runInvestigation(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = runInvestigationSchema.parse(req.body);
      const report = await AiInvestigationService.runInvestigation(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, report, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getReportDetails(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const report = await AiInvestigationService.getReportDetails(req.tenantId!, id);
      return sendSuccess(res, report);
    } catch (err) {
      next(err);
    }
  }
}
