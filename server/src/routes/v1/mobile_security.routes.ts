import { Router } from 'express';
import { MobileSecurityController } from '../../controllers/mobile_security.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/scans', MobileSecurityController.listScans);
router.post('/scans', MobileSecurityController.runMobileScan);
router.get('/scans/:id', MobileSecurityController.getScanDetails);

export default router;
