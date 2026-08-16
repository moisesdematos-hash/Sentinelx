import { Router } from 'express';
import { WebhookController } from '../../controllers/webhook.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/', WebhookController.create);
router.get('/', WebhookController.list);
router.get('/:id', WebhookController.getById);
router.delete('/:id', WebhookController.delete);
router.post('/:id/test', WebhookController.testDispatch);

export default router;
