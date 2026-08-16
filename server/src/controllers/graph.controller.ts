import { Response, NextFunction } from 'express';
import { SecurityGraphService } from '../services/security_graph.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class GraphController {
  static async getTopology(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const topology = await SecurityGraphService.getTopology(req.tenantId!);
      return sendSuccess(res, topology);
    } catch (err) {
      next(err);
    }
  }

  static async getAttackPaths(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const paths = await SecurityGraphService.getAttackPaths(req.tenantId!);
      return sendSuccess(res, paths);
    } catch (err) {
      next(err);
    }
  }

  static async calculateBlastRadius(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const nodeId = Array.isArray(req.params.nodeId) ? req.params.nodeId[0] : req.params.nodeId;
      const result = await SecurityGraphService.calculateBlastRadius(req.tenantId!, nodeId);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
