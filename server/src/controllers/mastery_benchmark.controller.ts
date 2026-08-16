import { Response, NextFunction } from 'express';
import { MasteryBenchmarkService } from '../services/mastery_benchmark.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class MasteryBenchmarkController {
  static async getMasteryBenchmark(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const benchmark = await MasteryBenchmarkService.getMasteryBenchmark(req.tenantId!);
      return sendSuccess(res, benchmark);
    } catch (err) {
      next(err);
    }
  }
}
