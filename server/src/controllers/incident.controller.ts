import { Response, NextFunction } from 'express';
import { IncidentService, createIncidentSchema, updateIncidentSchema } from '../services/incident.service.js';
import { sendSuccess } from '../utils/response.js';
import { TenantRequest } from '../middleware/tenant.middleware.js';

export class IncidentController {
  static async createIncident(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const validated = createIncidentSchema.parse(req.body);
      const incident = await IncidentService.createIncident(req.tenantId!, validated, req.user?.id);
      return sendSuccess(res, incident, 201);
    } catch (err) {
      next(err);
    }
  }

  static async listIncidents(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const filters = {
        status: req.query.status as string,
        severity: req.query.severity as string,
        assignee: req.query.assignee as string,
      };
      const incidents = await IncidentService.listIncidents(req.tenantId!, filters);
      return sendSuccess(res, incidents);
    } catch (err) {
      next(err);
    }
  }

  static async updateIncident(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const validated = updateIncidentSchema.parse(req.body);
      const updated = await IncidentService.updateIncident(req.tenantId!, id, validated, req.user?.id);
      return sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async addTimelineNote(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { content, actionType } = req.body;
      const note = await IncidentService.addTimelineNote(req.tenantId!, id, content, actionType, req.user?.id);
      return sendSuccess(res, note, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getIncidentTimeline(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const timeline = await IncidentService.getIncidentTimeline(req.tenantId!, id);
      return sendSuccess(res, timeline);
    } catch (err) {
      next(err);
    }
  }
}
