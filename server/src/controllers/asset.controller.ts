import { Response, NextFunction } from 'express';
import { AssetService, createAssetSchema, updateAssetSchema } from '../services/asset.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class AssetController {
  static async create(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createAssetSchema.parse(req.body);
      const asset = await AssetService.create(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, asset, 201);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        type: req.query.type as string,
        environment: req.query.environment as string,
        criticality: req.query.criticality as string,
        search: req.query.search as string,
      };
      const assets = await AssetService.listByOrganization(req.tenantId!, filters);
      return sendSuccess(res, assets);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const asset = await AssetService.getById(req.tenantId!, assetId);
      return sendSuccess(res, asset);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const validated = updateAssetSchema.parse(req.body);
      const asset = await AssetService.update(req.tenantId!, assetId, validated, req.user?.id);
      return sendSuccess(res, asset);
    } catch (err) {
      next(err);
    }
  }

  static async lockBaseline(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const baseline = await AssetService.lockBaseline(req.tenantId!, assetId, req.user?.id);
      return sendSuccess(res, baseline);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await AssetService.delete(req.tenantId!, assetId, req.user?.id);
      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}
