import { Response, NextFunction } from 'express';
import { WebhookService, createWebhookSchema } from '../services/webhook.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class WebhookController {
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createWebhookSchema.parse(req.body);
      const webhook = await WebhookService.create(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, webhook, 201);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const webhooks = await WebhookService.listByOrganization(req.tenantId!);
      return sendSuccess(res, webhooks);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const webhookId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const webhook = await WebhookService.getById(req.tenantId!, webhookId);
      return sendSuccess(res, webhook);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const webhookId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await WebhookService.delete(req.tenantId!, webhookId, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async testDispatch(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const webhookId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await WebhookService.testDispatch(req.tenantId!, webhookId);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
