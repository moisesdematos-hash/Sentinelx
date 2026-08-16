import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('SaaS Marketplace Billing Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should retrieve active subscription plan & usage meters', async () => {
    const res = await request(app)
      .get('/api/v1/subscriptions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.planTier).toBeDefined();
    expect(res.body.data.maxAssets).toBeGreaterThan(0);
  });

  it('should upgrade subscription tier to MSSP_PARTNER', async () => {
    const res = await request(app)
      .post('/api/v1/subscriptions/upgrade')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ planTier: 'MSSP_PARTNER' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.planTier).toBe('MSSP_PARTNER');
    expect(res.body.data.monthlyPrice).toBe(4999.0);
    expect(res.body.data.maxAssets).toBe(5000);
  });

  it('should list cloud marketplace entitlement sync status', async () => {
    const res = await request(app)
      .get('/api/v1/subscriptions/entitlements')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
