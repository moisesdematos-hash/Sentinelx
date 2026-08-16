import { Router } from 'express';
import { DetectionController } from '../../controllers/detection.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/rules', DetectionController.createRule);
router.get('/rules', DetectionController.listRules);
router.post('/evaluate', DetectionController.evaluateEvents);
router.get('/alerts', DetectionController.listAlerts);

export default router;
