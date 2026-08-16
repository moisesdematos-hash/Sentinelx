import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', authenticateUser, AuthController.me);
router.get('/audit-logs', authenticateUser, tenantMiddleware, AuthController.auditLogs);

export default router;
