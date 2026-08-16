import { Router } from 'express';
import { MicrosegmentationController } from '../../controllers/microsegmentation.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/segments', MicrosegmentationController.listSegments);
router.post('/segments', MicrosegmentationController.createSegment);
router.post('/segments/:id/rules', MicrosegmentationController.addPolicyRule);
router.post('/segments/:id/enforce', MicrosegmentationController.enforceZeroTrust);
router.get('/logs', MicrosegmentationController.getTrafficLogs);

export default router;
