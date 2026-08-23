import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { QuantumRollbackService } from '../services/quantum_rollback.service.js';
import { ApiResponse } from '../utils/response.js';

export class QuantumRollbackController {
  static async execute(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await QuantumRollbackService.executeRollback(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'Quantum Time Reversal Rollback completed in milliseconds');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async list(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const snapshots = await QuantumRollbackService.listSnapshots(orgId);
      return ApiResponse.success(res, snapshots);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
