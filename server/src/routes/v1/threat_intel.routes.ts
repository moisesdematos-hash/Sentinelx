import { Router } from 'express';
import { ThreatIntelController } from '../../controllers/threat_intel.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/sync', ThreatIntelController.syncThreatFeeds);
router.get('/indicators', ThreatIntelController.listIndicators);
router.get('/matches', ThreatIntelController.listMatches);

export default router;
