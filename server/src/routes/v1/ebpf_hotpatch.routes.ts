import { Router } from 'express';
import { EbpfHotPatchController } from '../../controllers/ebpf_hotpatch.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/apply', EbpfHotPatchController.applyPatch);
router.get('/patches', EbpfHotPatchController.listPatches);

export default router;
