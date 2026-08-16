import { Response, NextFunction } from 'express';
import { ThreatIntelService } from '../services/threat_intel.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class ThreatIntelController {
  static async syncThreatFeeds(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const result = await ThreatIntelService.syncThreatFeeds(req.tenantId!, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listIndicators(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        type: req.query.type as string,
        severity: req.query.severity as string,
        query: req.query.query as string,
        matchedOnly: req.query.matchedOnly === 'true',
      };
      const indicators = await ThreatIntelService.listIndicators(req.tenantId!, filters);
      return sendSuccess(res, indicators);
    } catch (err) {
      next(err);
    }
  }

  static async listMatches(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const matches = await ThreatIntelService.listMatches(req.tenantId!);
      return sendSuccess(res, matches);
    } catch (err) {
      next(err);
    }
  }
}
