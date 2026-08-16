import { Response, NextFunction } from 'express';
import { OrganizationService } from '../services/organization.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class OrganizationController {
  static async getCurrent(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const org = await OrganizationService.getById(req.tenantId!);
      return sendSuccess(res, org);
    } catch (err) {
      next(err);
    }
  }

  static async listAll(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const orgs = await OrganizationService.listAll();
      return sendSuccess(res, orgs);
    } catch (err) {
      next(err);
    }
  }
}
