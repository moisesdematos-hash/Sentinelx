import { Router } from 'express';
import { ThreatExchangeController } from '../../controllers/threat_exchange.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.get('/indicators', ThreatExchangeController.listIndicators);
router.post('/share', ThreatExchangeController.shareThreat);
router.post('/sync-blocklist', ThreatExchangeController.syncBlocklist);

export default router;
