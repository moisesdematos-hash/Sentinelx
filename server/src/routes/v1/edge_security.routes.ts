import { Router } from 'express';
import { EdgeSecurityController } from '../../controllers/edge_security.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/nodes', EdgeSecurityController.listEdgeNodes);
router.get('/iot-scans', EdgeSecurityController.listIotScans);
router.post('/scan', EdgeSecurityController.runEdgeScan);
router.post('/nodes/:id/ddos-mitigate', EdgeSecurityController.mitigateDdos);

export default router;
