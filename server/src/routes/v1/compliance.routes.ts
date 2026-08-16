import { Router } from 'express';
import { ComplianceController } from '../../controllers/compliance.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/audit', ComplianceController.runAudit);
router.get('/frameworks', ComplianceController.getFrameworks);
router.get('/controls', ComplianceController.listControls);
router.get('/export', ComplianceController.exportAuditReport);

export default router;
