import { Response, NextFunction } from 'express';
import { CloudPostureService } from '../services/cloud_posture.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class CloudPostureController {
  static async scanPosture(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const connectorId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await CloudPostureService.scanCloudPosture(req.tenantId!, connectorId, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getScans(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const connectorId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const scans = await CloudPostureService.getCspmScansByConnector(req.tenantId!, connectorId);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }
}
