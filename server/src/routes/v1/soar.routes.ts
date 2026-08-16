import { Router } from 'express';
import { SoarController } from '../../controllers/soar.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/playbooks', SoarController.listPlaybooks);
router.post('/playbooks', SoarController.createPlaybook);
router.post('/playbooks/:id/trigger', SoarController.triggerPlaybook);
router.get('/executions', SoarController.listExecutions);

export default router;
