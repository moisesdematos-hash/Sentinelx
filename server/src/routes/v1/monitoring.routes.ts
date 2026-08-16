import { Router } from 'express';
import { MonitoringController } from '../../controllers/monitoring.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/trigger', MonitoringController.triggerCycle);
router.get('/telemetry', MonitoringController.getTelemetry);
router.get('/status', MonitoringController.getStatus);

export default router;
