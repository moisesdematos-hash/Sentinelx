import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware.js';

export interface TenantRequest extends Request {
  tenantId?: string;
  user?: {
    id: string;
    organizationId: string;
    email: string;
    role: string;
  };
}

export function tenantMiddleware(
  req: TenantRequest,
  _res: Response,
  next: NextFunction
) {
  // Extract tenant ID from user token if authenticated, or header 'x-organization-id'
  const headerTenantId = req.headers['x-organization-id'] as string | undefined;
  const userTenantId = req.user?.organizationId;

  const tenantId = userTenantId || headerTenantId;

  if (!tenantId && req.path !== '/api/v1/health' && !req.path.startsWith('/api/v1/auth')) {
    return next(
      new AppError(
        400,
        'Organization context required. Set X-Organization-Id header or authenticate.',
        'MISSING_TENANT_CONTEXT'
      )
    );
  }

  req.tenantId = tenantId;
  next();
}
