import { Response, NextFunction } from 'express';
import { RemediationService, createRemediationTaskSchema } from '../services/remediation.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class RemediationController {
  static async listTasks(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const statusFilter = req.query.status as string;
      const tasks = await RemediationService.listTasks(req.tenantId!, statusFilter);
      return sendSuccess(res, tasks);
    } catch (err) {
      next(err);
    }
  }

  static async createTask(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createRemediationTaskSchema.parse(req.body);
      const task = await RemediationService.createTask(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, task, 201);
    } catch (err) {
      next(err);
    }
  }

  static async approveTask(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const task = await RemediationService.approveTask(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, task);
    } catch (err) {
      next(err);
    }
  }

  static async executeTask(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const task = await RemediationService.executeTask(req.tenantId!, id, req.user?.id);
      return sendSuccess(res, task);
    } catch (err) {
      next(err);
    }
  }
}
