import { Router } from 'express';
import { GraphController } from '../../controllers/graph.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/topology', GraphController.getTopology);
router.get('/attack-paths', GraphController.getAttackPaths);
router.get('/blast-radius/:nodeId', GraphController.calculateBlastRadius);

export default router;
