import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { VoiceMessagingCommandService } from '../services/voice_messaging_command.service.js';
import { ApiResponse } from '../utils/response.js';

export class VoiceMessagingCommandController {
  static async process(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const result = await VoiceMessagingCommandService.processCommand(orgId, req.body, req.user?.id);
      return ApiResponse.created(res, result, 'Voice/Messaging command executed successfully by Super AI');
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }

  static async getHistory(req: AuthRequest, res: Response) {
    try {
      const orgId = req.user?.organizationId || 'org-1';
      const history = await VoiceMessagingCommandService.getHistory(orgId);
      return ApiResponse.success(res, history);
    } catch (err: any) {
      return ApiResponse.error(res, err.message);
    }
  }
}
