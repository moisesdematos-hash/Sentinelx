import { Router } from 'express';
import { FinOpsSentinelController } from '../../controllers/finops_sentinel.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/purge-cryptomining', FinOpsSentinelController.purge);
router.get('/savings-summary', FinOpsSentinelController.getSummary);

export default router;
