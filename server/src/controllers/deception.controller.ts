import { Response, NextFunction } from 'express';
import { DeceptionService, createDeceptionDecoySchema } from '../services/deception.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class DeceptionController {
  static async listDecoys(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const decoys = await DeceptionService.listDecoys(req.tenantId!);
      return sendSuccess(res, decoys);
    } catch (err) {
      next(err);
    }
  }

  static async createDecoy(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createDeceptionDecoySchema.parse(req.body);
      const decoy = await DeceptionService.createDecoy(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, decoy, 201);
    } catch (err) {
      next(err);
    }
  }

  static async simulateIntrusion(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const { decoyId, attackerIp, userAgent, commandsAttempted } = req.body;
      const interaction = await DeceptionService.simulateIntrusion(
        req.tenantId!,
        decoyId,
        attackerIp,
        userAgent,
        commandsAttempted,
        req.user?.id
      );
      return sendSuccess(res, interaction, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listInteractions(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const interactions = await DeceptionService.listInteractions(req.tenantId!);
      return sendSuccess(res, interactions);
    } catch (err) {
      next(err);
    }
  }

  static async containAttacker(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await DeceptionService.containAttacker(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
