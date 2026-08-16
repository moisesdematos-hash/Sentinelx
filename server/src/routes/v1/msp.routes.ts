import { Router } from 'express';
import { MspController } from '../../controllers/msp.controller.js';
import { authenticateUser, authorizeRoles } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/summary', MspController.getSummary);
router.post('/clients', authorizeRoles('SUPER_ADMIN', 'PARTNER_ADMIN', 'ORG_ADMIN'), MspController.createClient);
router.post('/branding', authorizeRoles('SUPER_ADMIN', 'PARTNER_ADMIN', 'ORG_ADMIN'), MspController.updateBranding);

export default router;
