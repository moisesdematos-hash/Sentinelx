import { Router } from 'express';
import { RemediationController } from '../../controllers/remediation.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/tasks', RemediationController.listTasks);
router.post('/tasks', RemediationController.createTask);
router.post('/tasks/:id/approve', RemediationController.approveTask);
router.post('/tasks/:id/execute', RemediationController.executeTask);

export default router;
