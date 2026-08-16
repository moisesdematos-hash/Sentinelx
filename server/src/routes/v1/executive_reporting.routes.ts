import { Router } from 'express';
import { ExecutiveReportingController } from '../../controllers/executive_reporting.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/', ExecutiveReportingController.listReports);
router.post('/generate', ExecutiveReportingController.compileBoardReport);
router.get('/:id/pdf', ExecutiveReportingController.renderPdfPreview);

export default router;
