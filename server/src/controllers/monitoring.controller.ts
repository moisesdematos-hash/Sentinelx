import { Response, NextFunction } from 'express';
import { MonitoringService } from '../services/monitoring.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class MonitoringController {
  static async triggerCycle(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const result = await MonitoringService.triggerMonitoringCycle(req.tenantId!, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getTelemetry(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const telemetry = await MonitoringService.getTelemetryFeed(req.tenantId!, limit);
      return sendSuccess(res, telemetry);
    } catch (err) {
      next(err);
    }
  }

  static async getStatus(_req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const status = await MonitoringService.getEngineStatus();
      return sendSuccess(res, status);
    } catch (err) {
      next(err);
    }
  }
}
