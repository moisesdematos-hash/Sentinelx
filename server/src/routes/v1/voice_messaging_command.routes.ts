import { Router } from 'express';
import { VoiceMessagingCommandController } from '../../controllers/voice_messaging_command.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/process', VoiceMessagingCommandController.process);
router.get('/history', VoiceMessagingCommandController.getHistory);

export default router;
