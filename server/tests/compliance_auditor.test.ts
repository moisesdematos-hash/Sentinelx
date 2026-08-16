import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Compliance Auditor Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should trigger automated compliance audit run across all frameworks', async () => {
    const res = await request(app)
      .post('/api/v1/compliance/audit')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBe(5); // ISO_27001, SOC2_TYPE2, PCI_DSS_V4, HIPAA, GDPR
  });

  it('should list framework readiness summaries with percentage scores', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/frameworks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].readinessScore).toBeDefined();
  });

  it('should list controls with PASS/FAIL evaluation status and evidence', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/controls')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data[0].evidence).toBeDefined();
  });

  it('should export audit report evidence package', async () => {
    const res = await request(app)
      .get('/api/v1/compliance/export')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.summary).toBeDefined();
    expect(res.body.data.evidenceControls).toBeDefined();
  });
});
