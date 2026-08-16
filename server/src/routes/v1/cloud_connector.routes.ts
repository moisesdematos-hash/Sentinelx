import { Router } from 'express';
import { CloudConnectorController } from '../../controllers/cloud_connector.controller.js';
import { CloudPostureController } from '../../controllers/cloud_posture.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/', CloudConnectorController.create);
router.get('/', CloudConnectorController.list);
router.post('/:id/sync', CloudConnectorController.sync);

router.post('/:id/cspm-scan', CloudPostureController.scanPosture);
router.get('/:id/cspm-scan', CloudPostureController.getScans);

export default router;
