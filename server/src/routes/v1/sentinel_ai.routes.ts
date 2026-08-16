import { Router } from 'express';
import { SentinelAiController } from '../../controllers/sentinel_ai.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/chat', SentinelAiController.chat);
router.post('/analyze', SentinelAiController.analyze);
router.get('/recommendations', SentinelAiController.listRecommendations);

export default router;
