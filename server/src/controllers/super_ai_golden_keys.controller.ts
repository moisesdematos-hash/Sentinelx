import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { SuperAiGoldenKeysService } from '../services/super_ai_golden_keys.service.js';
import { ApiResponse } from '../utils/response.js';

export class SuperAiGoldenKeysController {
  static async multiLlmChat(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.processMultiLlmChat(orgId, req.body, req.user?.id);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async ragSearch(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.searchRagVectorMemory(orgId, req.body);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async reactLoop(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.runReActAgenticLoop(orgId, req.body, req.user?.id);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async astPatch(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.synthesizeAstPatch(orgId, req.body);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async threatHunt(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.runProactiveThreatHunt(orgId, req.body);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async insuranceCertificate(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.generateCyberInsuranceCertificate(orgId);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async boardPdf(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.generateBoardExecutivePdf(orgId);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async compliancePassport(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.getContinuousCompliancePassport(orgId);
      return ApiResponse.success(res, result);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async killSwitch(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await SuperAiGoldenKeysService.executeEnterpriseKillSwitch(orgId, req.user?.id);
      return ApiResponse.created(res, result, 'Enterprise Kill Switch activated. All routes isolated in Air-Gap mode.');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
