import { Router } from 'express';
import { SiemController } from '../../controllers/siem.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/integrations', SiemController.listIntegrations);
router.post('/integrations', SiemController.createIntegration);
router.post('/integrations/:id/test', SiemController.testDispatch);
router.get('/logs', SiemController.getDeliveryLogs);

export default router;
