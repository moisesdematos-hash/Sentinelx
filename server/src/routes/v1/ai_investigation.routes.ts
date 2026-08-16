import { Router } from 'express';
import { AiInvestigationController } from '../../controllers/ai_investigation.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/', AiInvestigationController.listReports);
router.post('/', AiInvestigationController.runInvestigation);
router.get('/:id', AiInvestigationController.getReportDetails);

export default router;
