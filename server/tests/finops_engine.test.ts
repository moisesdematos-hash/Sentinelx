import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Cloud FinOps & Security ROI Optimization Engine Integration Tests', () => {
  let authToken: string;
  let recommendationId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should retrieve security spending and ROI metrics', async () => {
    const res = await request(app)
      .get('/api/v1/finops/metrics')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monthlySecuritySpend).toBeGreaterThan(0);
    expect(res.body.data.roiPercentage).toBeGreaterThan(0);
  });

  it('should list cost optimization recommendations', async () => {
    const res = await request(app)
      .get('/api/v1/finops/recommendations')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    recommendationId = res.body.data[0].id;
  });

  it('should apply 1-click cost reduction recommendation', async () => {
    const res = await request(app)
      .post(`/api/v1/finops/recommendations/${recommendationId}/apply`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('APPLIED');
    expect(res.body.data.appliedAt).not.toBeNull();
  });

  it('should trigger real-time cloud wastage discovery analysis', async () => {
    const res = await request(app)
      .post('/api/v1/finops/analyze')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monthlySecuritySpend).toBeGreaterThan(0);
  });
});
