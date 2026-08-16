import { Router } from 'express';
import { OrganizationController } from '../../controllers/organization.controller.js';
import { authenticateUser, authorizeRoles } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser);

router.get('/current', tenantMiddleware, OrganizationController.getCurrent);
router.get('/', authorizeRoles('SUPER_ADMIN', 'PARTNER_ADMIN'), OrganizationController.listAll);

export default router;
