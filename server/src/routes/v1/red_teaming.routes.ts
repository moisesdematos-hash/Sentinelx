import { Router } from 'express';
import { RedTeamingController } from '../../controllers/red_teaming.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/simulate', RedTeamingController.runSimulation);
router.get('/stats', RedTeamingController.getStats);

export default router;
