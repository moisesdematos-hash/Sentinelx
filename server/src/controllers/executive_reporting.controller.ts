import { Response, NextFunction } from 'express';
import { ExecutiveReportingService } from '../services/executive_reporting.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class ExecutiveReportingController {
  static async listReports(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const reports = await ExecutiveReportingService.listReports(req.tenantId!);
      return sendSuccess(res, reports);
    } catch (err) {
      next(err);
    }
  }

  static async compileBoardReport(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const period = req.body.period as string;
      const report = await ExecutiveReportingService.compileBoardReport(
        req.tenantId!,
        period,
        req.user?.id
      );
      return sendSuccess(res, report, 201);
    } catch (err) {
      next(err);
    }
  }

  static async renderPdfPreview(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const html = await ExecutiveReportingService.renderPdfPreview(req.tenantId!, id);
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    } catch (err) {
      next(err);
    }
  }
}
