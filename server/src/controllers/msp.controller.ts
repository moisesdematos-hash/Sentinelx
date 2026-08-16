import { Response, NextFunction } from 'express';
import { MspService, createClientOrgSchema, updateBrandingSchema } from '../services/msp.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class MspController {
  static async getSummary(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const summary = await MspService.getPortfolioSummary();
      return sendSuccess(res, summary);
    } catch (err) {
      next(err);
    }
  }

  static async createClient(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createClientOrgSchema.parse(req.body);
      const client = await MspService.createClientOrganization(validated);
      return sendSuccess(res, client, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateBranding(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = updateBrandingSchema.parse(req.body);
      // Default to main partner ID or tenant context
      const partnerId = (req.body.partnerId as string) || 'cyberdefense-msp';
      const branding = await MspService.updateBranding(validated, partnerId);
      return sendSuccess(res, branding);
    } catch (err) {
      next(err);
    }
  }
}
