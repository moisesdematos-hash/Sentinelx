import { Response, NextFunction } from 'express';
import { EdgeSecurityService } from '../services/edge_security.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class EdgeSecurityController {
  static async listEdgeNodes(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const nodes = await EdgeSecurityService.listEdgeNodes(req.tenantId!);
      return sendSuccess(res, nodes);
    } catch (err) {
      next(err);
    }
  }

  static async listIotScans(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const scans = await EdgeSecurityService.listIotScans(req.tenantId!);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }

  static async runEdgeScan(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const nodes = await EdgeSecurityService.runEdgeScan(req.tenantId!, req.user?.id);
      return sendSuccess(res, nodes);
    } catch (err) {
      next(err);
    }
  }

  static async mitigateDdos(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const node = await EdgeSecurityService.mitigateDdos(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, node);
    } catch (err) {
      next(err);
    }
  }
}
