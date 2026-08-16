import { Response, NextFunction } from 'express';
import { ThreatExchangeService, shareThreatSchema } from '../services/threat_exchange.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class ThreatExchangeController {
  static async listIndicators(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const indicators = await ThreatExchangeService.listIndicators(req.tenantId!);
      return sendSuccess(res, indicators);
    } catch (err) {
      next(err);
    }
  }

  static async shareThreat(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = shareThreatSchema.parse(req.body);
      const threat = await ThreatExchangeService.shareThreat(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, threat, 201);
    } catch (err) {
      next(err);
    }
  }

  static async syncBlocklist(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const result = await ThreatExchangeService.syncBlocklist(req.tenantId!, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
