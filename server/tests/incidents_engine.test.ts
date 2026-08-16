import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Incident Center Engine Integration Tests', () => {
  let authToken: string;
  let incidentId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list active incidents including pre-seeded SLA tracked cases', async () => {
    const res = await request(app)
      .get('/api/v1/incidents')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].slaExpiresAt).toBeDefined();

    incidentId = res.body.data[0].id;
  });

  it('should create a new incident case with SLA response calculation', async () => {
    const res = await request(app)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '[P1 INCIDENT] BOLA Authorization Drift on /api/v1/users',
        description: 'Broken Object Level Authorization flaw allowing unprivileged API data access.',
        severity: 'HIGH',
        assignee: 'API Security Team Lead',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('OPEN');
    expect(res.body.data.severity).toBe('HIGH');
  });

  it('should update incident lifecycle status and add timeline audit notes', async () => {
    const patchRes = await request(app)
      .patch(`/api/v1/incidents/${incidentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        status: 'IN_CONTAINMENT',
        assignee: 'Senior Incident Responder',
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.status).toBe('IN_CONTAINMENT');

    const noteRes = await request(app)
      .post(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'AppArmor confinement profile enforced on container pod.',
        actionType: 'CONTAINMENT_ACTION',
      });

    expect(noteRes.status).toBe(201);
    expect(noteRes.body.data.content).toContain('AppArmor');
  });

  it('should retrieve complete incident timeline audit trail', async () => {
    const res = await request(app)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
