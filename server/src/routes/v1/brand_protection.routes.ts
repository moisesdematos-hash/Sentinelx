import { Router } from 'express';
import { BrandProtectionController } from '../../controllers/brand_protection.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/domains', BrandProtectionController.listDomains);
router.post('/scan', BrandProtectionController.scanImpersonation);
router.post('/domains/:id/takedown', BrandProtectionController.submitTakedown);
router.get('/leaks', BrandProtectionController.listLeaks);

export default router;
