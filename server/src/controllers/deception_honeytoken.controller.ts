import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { DeceptionHoneytokenService } from '../services/deception_honeytoken.service.js';
import { ApiResponse } from '../utils/response.js';

export class DeceptionHoneytokenController {
  static async generate(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await DeceptionHoneytokenService.generateHoneytoken(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'Honeytoken armed and active');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async list(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const tokens = await DeceptionHoneytokenService.listActiveHoneytokens(orgId);
      return ApiResponse.success(res, tokens);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
