import { Response, NextFunction } from 'express';
import { CloudConnectorService, createCloudConnectorSchema } from '../services/cloud_connector.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class CloudConnectorController {
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createCloudConnectorSchema.parse(req.body);
      const connector = await CloudConnectorService.createConnector(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, connector, 201);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const connectors = await CloudConnectorService.listConnectors(req.tenantId!);
      return sendSuccess(res, connectors);
    } catch (err) {
      next(err);
    }
  }

  static async sync(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const connectorId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await CloudConnectorService.syncConnectorAssets(req.tenantId!, connectorId, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
