import { Router } from 'express';
import { AutopilotController } from '../../controllers/autopilot.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/policies', AutopilotController.listPolicies);
router.post('/policies', AutopilotController.createPolicy);
router.post('/execute', AutopilotController.executeSelfDefense);
router.get('/actions', AutopilotController.listActions);
router.post('/kill-switch', AutopilotController.triggerKillSwitch);

export default router;
