import { Router } from 'express';
import { SelfHealingController } from '../../controllers/self_healing.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/patches', SelfHealingController.listPatches);
router.post('/patches', SelfHealingController.synthesizePatch);
router.post('/patches/:id/apply', SelfHealingController.applyPatch);

export default router;
