import { Response, NextFunction } from 'express';
import { SelfHealingService, createPatchSchema } from '../services/self_healing.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class SelfHealingController {
  static async listPatches(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const patches = await SelfHealingService.listPatches(req.tenantId!);
      return sendSuccess(res, patches);
    } catch (err) {
      next(err);
    }
  }

  static async synthesizePatch(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createPatchSchema.parse(req.body);
      const patch = await SelfHealingService.synthesizePatch(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, patch, 201);
    } catch (err) {
      next(err);
    }
  }

  static async applyPatch(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const patch = await SelfHealingService.applyPatch(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, patch);
    } catch (err) {
      next(err);
    }
  }
}
