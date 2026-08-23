import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { EbpfHotPatchService } from '../services/ebpf_hotpatch.service.js';
import { ApiResponse } from '../utils/response.js';

export class EbpfHotPatchController {
  static async applyPatch(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await EbpfHotPatchService.applyPatch(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'eBPF Kernel Hot-Patch applied with 0ms downtime');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async listPatches(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const patches = await EbpfHotPatchService.listActivePatches(orgId);
      return ApiResponse.success(res, patches);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
