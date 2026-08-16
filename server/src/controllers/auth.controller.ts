import { Request, Response, NextFunction } from 'express';
import { AuthService, registerSchema, loginSchema } from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';
import { AuditService } from '../services/audit.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.register(validated, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      });
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async me(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, { user: req.user, tenantId: req.tenantId });
    } catch (err) {
      next(err);
    }
  }

  static async auditLogs(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await AuditService.listByOrganization(req.tenantId!, limit, page);
      return sendSuccess(res, logs.items, 200, {
        page: logs.page,
        limit: logs.limit,
        total: logs.total,
      });
    } catch (err) {
      next(err);
    }
  }
}
