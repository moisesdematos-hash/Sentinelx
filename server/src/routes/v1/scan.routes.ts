import { Router } from 'express';
import { ScanController } from '../../controllers/scan.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/website', ScanController.scanWebsite);
router.get('/website/:assetId', ScanController.getScansByAsset);

router.post('/server', ScanController.scanServer);
router.get('/server/:assetId', ScanController.getServerScansByAsset);

router.post('/api', ScanController.scanApi);
router.get('/api/:assetId', ScanController.getApiScansByAsset);

router.post('/container', ScanController.scanContainer);
router.get('/container/:assetId', ScanController.getContainerScansByAsset);

export default router;
