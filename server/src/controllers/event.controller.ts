import { Response, NextFunction } from 'express';
import { EventBusService, publishSecurityEventSchema } from '../services/event_bus.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class EventController {
  static async publish(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = publishSecurityEventSchema.parse(req.body);
      const event = await EventBusService.publishEvent(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, event, 201);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        sourceEngine: req.query.sourceEngine as string,
        severity: req.query.severity as string,
        assetId: req.query.assetId as string,
        limit: parseInt(req.query.limit as string) || 50,
      };
      const events = await EventBusService.getEvents(req.tenantId!, filters);
      return sendSuccess(res, events);
    } catch (err) {
      next(err);
    }
  }

  static stream(req: TenantRequest, res: Response) {
    EventBusService.subscribeToStream(req.tenantId!, res);
  }
}
