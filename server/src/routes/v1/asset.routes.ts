import { Router } from 'express';
import { AssetController } from '../../controllers/asset.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/', AssetController.create);
router.get('/', AssetController.list);
router.get('/:id', AssetController.getById);
router.put('/:id', AssetController.update);
router.post('/:id/baseline', AssetController.lockBaseline);
router.delete('/:id', AssetController.delete);

export default router;
