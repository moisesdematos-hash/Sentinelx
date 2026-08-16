import { Router } from 'express';
import { IdentityController } from '../../controllers/identity.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/risks', IdentityController.listRisks);
router.post('/jit-requests', IdentityController.createJitRequest);
router.get('/jit-requests', IdentityController.listJitRequests);
router.post('/jit-requests/:id/approve', IdentityController.approveJitRequest);
router.post('/risks/:id/lockout', IdentityController.lockoutIdentity);

export default router;
