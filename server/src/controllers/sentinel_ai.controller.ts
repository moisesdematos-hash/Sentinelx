import { Response, NextFunction } from 'express';
import { SentinelAiService, chatPromptSchema, generateAnalysisSchema } from '../services/sentinel_ai.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class SentinelAiController {
  static async chat(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = chatPromptSchema.parse(req.body);
      const conversation = await SentinelAiService.chat(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, conversation, 201);
    } catch (err) {
      next(err);
    }
  }

  static async analyze(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = generateAnalysisSchema.parse(req.body);
      const recommendation = await SentinelAiService.generateAnalysis(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, recommendation, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listRecommendations(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const recommendations = await SentinelAiService.listRecommendations(req.tenantId!);
      return sendSuccess(res, recommendations);
    } catch (err) {
      next(err);
    }
  }
}
