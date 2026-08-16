import { Router } from 'express';
import { RecoveryController } from '../../controllers/recovery.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/baselines', RecoveryController.listBaselines);
router.post('/rollback', RecoveryController.executeRollback);
router.post('/restore-asset', RecoveryController.restoreAsset);
router.get('/rollbacks', RecoveryController.listRollbacks);

export default router;
