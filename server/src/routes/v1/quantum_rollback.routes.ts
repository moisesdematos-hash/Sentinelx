import { Router } from 'express';
import { QuantumRollbackController } from '../../controllers/quantum_rollback.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/execute', QuantumRollbackController.execute);
router.get('/snapshots', QuantumRollbackController.list);

export default router;
