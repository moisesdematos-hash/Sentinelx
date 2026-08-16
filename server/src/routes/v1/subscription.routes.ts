import { Router } from 'express';
import { SubscriptionController } from '../../controllers/subscription.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/', SubscriptionController.getSubscription);
router.post('/upgrade', SubscriptionController.upgradeTier);
router.get('/entitlements', SubscriptionController.listEntitlements);

export default router;
