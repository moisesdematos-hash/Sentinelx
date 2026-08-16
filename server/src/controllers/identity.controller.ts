import { Response, NextFunction } from 'express';
import { IdentityService, createJitRequestSchema } from '../services/identity.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class IdentityController {
  static async listRisks(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const risks = await IdentityService.listRisks(req.tenantId!);
      return sendSuccess(res, risks);
    } catch (err) {
      next(err);
    }
  }

  static async createJitRequest(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createJitRequestSchema.parse(req.body);
      const request = await IdentityService.createJitRequest(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, request, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listJitRequests(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const requests = await IdentityService.listJitRequests(req.tenantId!);
      return sendSuccess(res, requests);
    } catch (err) {
      next(err);
    }
  }

  static async approveJitRequest(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const approved = req.body.approved !== false;
      const result = await IdentityService.approveJitRequest(req.tenantId!, id, approved, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async lockoutIdentity(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await IdentityService.lockoutIdentity(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
