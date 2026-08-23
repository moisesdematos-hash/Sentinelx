import { Router } from 'express';
import { SuperAiGoldenKeysController } from '../../controllers/super_ai_golden_keys.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();
router.use(authenticateUser, tenantMiddleware);

router.post('/multi-llm-chat', SuperAiGoldenKeysController.multiLlmChat);
router.post('/rag-search', SuperAiGoldenKeysController.ragSearch);
router.post('/react-loop', SuperAiGoldenKeysController.reactLoop);
router.post('/ast-patch', SuperAiGoldenKeysController.astPatch);
router.post('/threat-hunt', SuperAiGoldenKeysController.threatHunt);
router.get('/insurance-certificate', SuperAiGoldenKeysController.insuranceCertificate);
router.get('/board-pdf', SuperAiGoldenKeysController.boardPdf);
router.get('/compliance-passport', SuperAiGoldenKeysController.compliancePassport);
router.post('/kill-switch', SuperAiGoldenKeysController.killSwitch);

export default router;
