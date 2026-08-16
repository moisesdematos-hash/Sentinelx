import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('API Security Engine Integration Tests', () => {
  let authToken: string;
  let apiAssetId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;

    // Create API Asset
    const assetRes = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Core Payment Gateway REST API',
        type: 'API',
        target: 'https://api.sentinelx.io/v1',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
      });

    apiAssetId = assetRes.body.data.id;
  });

  it('should execute an API security scan and return endpoint matrix, BOLA, PII, and rate limit metrics', async () => {
    const res = await request(app)
      .post('/api/v1/scans/api')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ assetId: apiAssetId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(90);
    expect(res.body.data.endpointsStatus).toBeInstanceOf(Array);
    expect(res.body.data.endpointsStatus.length).toBeGreaterThan(0);
    expect(res.body.data.authDriftStatus.bearerTokenCompliant).toBe(true);
  });

  it('should retrieve API scan history for a specific API asset', async () => {
    const res = await request(app)
      .get(`/api/v1/scans/api/${apiAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].rateLimitStatus.rateLimitHeaderPresent).toBe(true);
  });
});
