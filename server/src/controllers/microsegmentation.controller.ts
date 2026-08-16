import { Response, NextFunction } from 'express';
import {
  MicrosegmentationService,
  createSegmentSchema,
  createRuleSchema,
} from '../services/microsegmentation.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class MicrosegmentationController {
  static async listSegments(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const segments = await MicrosegmentationService.listSegments(req.tenantId!);
      return sendSuccess(res, segments);
    } catch (err) {
      next(err);
    }
  }

  static async createSegment(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createSegmentSchema.parse(req.body);
      const segment = await MicrosegmentationService.createSegment(
        req.tenantId!,
        validated,
        req.user?.id
      );
      return sendSuccess(res, segment, 201);
    } catch (err) {
      next(err);
    }
  }

  static async addPolicyRule(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const segmentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const validated = createRuleSchema.parse(req.body);
      const rule = await MicrosegmentationService.addPolicyRule(
        req.tenantId!,
        segmentId,
        validated,
        req.user?.id
      );
      return sendSuccess(res, rule, 201);
    } catch (err) {
      next(err);
    }
  }

  static async enforceZeroTrust(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const segment = await MicrosegmentationService.enforceZeroTrust(
        req.tenantId!,
        id,
        req.user?.id
      );
      return sendSuccess(res, segment);
    } catch (err) {
      next(err);
    }
  }

  static async getTrafficLogs(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const logs = await MicrosegmentationService.getTrafficLogs(req.tenantId!);
      return sendSuccess(res, logs);
    } catch (err) {
      next(err);
    }
  }
}
