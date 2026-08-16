import { Router } from 'express';
import { RiskController } from '../../controllers/risk.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/calculate', RiskController.calculateRisk);
router.get('/matrix', RiskController.getPriorityMatrix);

export default router;
