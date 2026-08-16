import { Router } from 'express';
import { DeceptionController } from '../../controllers/deception.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/decoys', DeceptionController.listDecoys);
router.post('/decoys', DeceptionController.createDecoy);
router.post('/simulate', DeceptionController.simulateIntrusion);
router.get('/interactions', DeceptionController.listInteractions);
router.post('/interactions/:id/contain', DeceptionController.containAttacker);

export default router;
