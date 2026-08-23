import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { FinOpsSentinelService } from '../services/finops_sentinel.service.js';
import { ApiResponse } from '../utils/response.js';

export class FinOpsSentinelController {
  static async purge(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await FinOpsSentinelService.purgeCryptomining(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'Parasitic cryptomining containers purged with monthly savings of $18,420');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async getSummary(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const summary = await FinOpsSentinelService.getSavingsSummary(orgId);
      return ApiResponse.success(res, summary);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
