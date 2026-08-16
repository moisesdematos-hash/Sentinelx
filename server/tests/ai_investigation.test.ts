import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('AI Incident Analyst & Autonomous Investigation Engine Integration Tests', () => {
  let authToken: string;
  let reportId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list completed AI investigation reports', async () => {
    const res = await request(app)
      .get('/api/v1/ai-investigations')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    reportId = res.body.data[0].id;
  });

  it('should trigger multi-agent root-cause incident investigation', async () => {
    const res = await request(app)
      .post('/api/v1/ai-investigations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        incidentTitle: 'Suspicious Administrative Session Escalation via SSH',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.attackStoryboard).toBeDefined();
    expect(res.body.data.confidenceScore).toBeGreaterThan(90);
  });

  it('should retrieve full attack storyboard & executive CISO briefing report', async () => {
    const res = await request(app)
      .get(`/api/v1/ai-investigations/${reportId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.cisoBriefing).toBeDefined();
  });
});
