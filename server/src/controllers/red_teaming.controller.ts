import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { RedTeamingService } from '../services/red_teaming.service.js';
import { ApiResponse } from '../utils/response.js';

export class RedTeamingController {
  static async runSimulation(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await RedTeamingService.runSimulation(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'Red Teaming attack simulation completed safely');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async getStats(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const stats = await RedTeamingService.getStats(orgId);
      return ApiResponse.success(res, stats);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
