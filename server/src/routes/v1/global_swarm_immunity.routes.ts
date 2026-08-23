import { Router } from 'express';
import { GlobalSwarmImmunityController } from '../../controllers/global_swarm_immunity.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/inoculate', GlobalSwarmImmunityController.inoculate);
router.get('/network-status', GlobalSwarmImmunityController.getStatus);

export default router;
