import { Router } from 'express';
import { EventController } from '../../controllers/event.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/', EventController.publish);
router.get('/', EventController.list);
router.get('/stream', EventController.stream);

export default router;
