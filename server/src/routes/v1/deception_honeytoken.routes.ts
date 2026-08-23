import { Router } from 'express';
import { DeceptionHoneytokenController } from '../../controllers/deception_honeytoken.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/generate', DeceptionHoneytokenController.generate);
router.get('/active', DeceptionHoneytokenController.list);

export default router;
