import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Executive Board Reporting Engine Integration Tests', () => {
  let authToken: string;
  let reportId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list generated executive board briefings', async () => {
    const res = await request(app)
      .get('/api/v1/executive-reports')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    reportId = res.body.data[0].id;
  });

  it('should compile real-time executive board report', async () => {
    const res = await request(app)
      .post('/api/v1/executive-reports/generate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ period: 'Q4 2026' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.period).toBe('Q4 2026');
    expect(res.body.data.securityScore).toBeGreaterThan(90);
  });

  it('should render HTML/PDF formatted report export preview', async () => {
    const res = await request(app)
      .get(`/api/v1/executive-reports/${reportId}/pdf`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.text).toContain('SENTINELX EXECUTIVE BOARD BRIEFING');
  });
});
