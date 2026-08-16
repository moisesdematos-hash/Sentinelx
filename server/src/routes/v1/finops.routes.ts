import { Router } from 'express';
import { FinOpsController } from '../../controllers/finops.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/metrics', FinOpsController.getMetrics);
router.get('/recommendations', FinOpsController.listRecommendations);
router.post('/recommendations/:id/apply', FinOpsController.applyRecommendation);
router.post('/analyze', FinOpsController.analyzeCloudWastage);

export default router;
