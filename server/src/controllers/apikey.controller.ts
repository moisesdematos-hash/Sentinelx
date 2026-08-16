import { Response, NextFunction } from 'express';
import { ApiKeyService, createApiKeySchema } from '../services/apikey.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class ApiKeyController {
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createApiKeySchema.parse(req.body);
      const result = await ApiKeyService.create(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const keys = await ApiKeyService.listByOrganization(req.tenantId!);
      return sendSuccess(res, keys);
    } catch (err) {
      next(err);
    }
  }

  static async revoke(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const keyId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await ApiKeyService.revoke(req.tenantId!, keyId, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
