import { Router } from 'express';
import { MasteryBenchmarkController } from '../../controllers/mastery_benchmark.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/', MasteryBenchmarkController.getMasteryBenchmark);

export default router;
