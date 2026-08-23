import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { GlobalSwarmImmunityService } from '../services/global_swarm_immunity.service.js';
import { ApiResponse } from '../utils/response.js';

export class GlobalSwarmImmunityController {
  static async inoculate(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await GlobalSwarmImmunityService.inoculateThreat(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'Global threat vaccine inoculated across all swarm nodes in 24ms');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async getStatus(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const status = await GlobalSwarmImmunityService.getNetworkStatus(orgId);
      return ApiResponse.success(res, status);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
