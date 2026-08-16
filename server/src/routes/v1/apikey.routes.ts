import { Router } from 'express';
import { ApiKeyController } from '../../controllers/apikey.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/', ApiKeyController.create);
router.get('/', ApiKeyController.list);
router.delete('/:id', ApiKeyController.revoke);

export default router;
