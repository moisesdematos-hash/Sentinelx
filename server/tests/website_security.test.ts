import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Website Security Engine Integration Tests', () => {
  let authToken: string;
  let websiteAssetId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;

    // Create Website Asset
    const assetRes = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Corporate Portal HTTPS',
        type: 'WEBSITE',
        target: 'https://sentinelx.io',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
      });

    websiteAssetId = assetRes.body.data.id;
  });

  it('should execute a website security scan and return TLS, headers, and cookie metrics', async () => {
    const res = await request(app)
      .post('/api/v1/scans/website')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ assetId: websiteAssetId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(90);
    expect(res.body.data.tlsStatus.protocolVersion).toBe('TLSv1.3');
    expect(res.body.data.headersStatus.strictTransportSecurity.compliant).toBe(true);
    expect(res.body.data.headersStatus.contentSecurityPolicy.compliant).toBe(true);
  });

  it('should retrieve scan history for a specific website asset', async () => {
    const res = await request(app)
      .get(`/api/v1/scans/website/${websiteAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].tlsStatus.issuer).toBeDefined();
  });
});
