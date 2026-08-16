import { Response, NextFunction } from 'express';
import { SoarService, createSoarPlaybookSchema } from '../services/soar.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class SoarController {
  static async listPlaybooks(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const playbooks = await SoarService.listPlaybooks(req.tenantId!);
      return sendSuccess(res, playbooks);
    } catch (err) {
      next(err);
    }
  }

  static async createPlaybook(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createSoarPlaybookSchema.parse(req.body);
      const playbook = await SoarService.createPlaybook(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, playbook, 201);
    } catch (err) {
      next(err);
    }
  }

  static async triggerPlaybook(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const targetResource = req.body.targetResource as string;
      const log = await SoarService.triggerPlaybook(req.tenantId!, id, targetResource, req.user?.id);
      return sendSuccess(res, log, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listExecutions(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const executions = await SoarService.listExecutions(req.tenantId!);
      return sendSuccess(res, executions);
    } catch (err) {
      next(err);
    }
  }
}
