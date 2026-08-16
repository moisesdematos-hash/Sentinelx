import { Response, NextFunction } from 'express';
import { WebsiteScannerService } from '../services/website_scanner.service.js';
import { ServerScannerService } from '../services/server_scanner.service.js';
import { ApiScannerService } from '../services/api_scanner.service.js';
import { ContainerScannerService } from '../services/container_scanner.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class ScanController {
  static async scanWebsite(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const { assetId } = req.body;
      const result = await WebsiteScannerService.scanWebsite(req.tenantId!, assetId, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getScansByAsset(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.assetId) ? req.params.assetId[0] : req.params.assetId;
      const scans = await WebsiteScannerService.getScansByAsset(req.tenantId!, assetId);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }

  static async scanServer(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const { assetId } = req.body;
      const result = await ServerScannerService.scanServer(req.tenantId!, assetId, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getServerScansByAsset(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.assetId) ? req.params.assetId[0] : req.params.assetId;
      const scans = await ServerScannerService.getScansByAsset(req.tenantId!, assetId);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }

  static async scanApi(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const { assetId } = req.body;
      const result = await ApiScannerService.scanApi(req.tenantId!, assetId, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getApiScansByAsset(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.assetId) ? req.params.assetId[0] : req.params.assetId;
      const scans = await ApiScannerService.getScansByAsset(req.tenantId!, assetId);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }

  static async scanContainer(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const { assetId } = req.body;
      const result = await ContainerScannerService.scanContainer(req.tenantId!, assetId, req.user?.id);
      return sendSuccess(res, result, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getContainerScansByAsset(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const assetId = Array.isArray(req.params.assetId) ? req.params.assetId[0] : req.params.assetId;
      const scans = await ContainerScannerService.getScansByAsset(req.tenantId!, assetId);
      return sendSuccess(res, scans);
    } catch (err) {
      next(err);
    }
  }
}
