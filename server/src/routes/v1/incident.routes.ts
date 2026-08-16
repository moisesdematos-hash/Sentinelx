import { Router } from 'express';
import { IncidentController } from '../../controllers/incident.controller.js';
import { authenticateUser } from '../../middleware/auth.middleware.js';
import { tenantMiddleware } from '../../middleware/tenant.middleware.js';

const router = Router();

router.use(authenticateUser, tenantMiddleware);

router.post('/', IncidentController.createIncident);
router.get('/', IncidentController.listIncidents);
router.patch('/:id', IncidentController.updateIncident);
router.post('/:id/timeline', IncidentController.addTimelineNote);
router.get('/:id/timeline', IncidentController.getIncidentTimeline);

export default router;
