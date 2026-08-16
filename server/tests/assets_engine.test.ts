import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Asset Inventory Engine Integration Tests', () => {
  let authToken: string;
  let testAssetId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should register a new container asset with metadata and initial baseline', async () => {
    const res = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Payment Processing Microservice',
        type: 'CONTAINER',
        target: 'docker.io/corp/payment-service:v2.4.0',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
        owner: 'SecOps Team Alpha',
        tags: ['pci-dss', 'core-finance', 'docker'],
        metadata: { imageHash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.tags).toContain('pci-dss');
    testAssetId = res.body.data.id;
  });

  it('should retrieve asset details including latest baseline configuration', async () => {
    const res = await request(app)
      .get(`/api/v1/assets/${testAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.baselines).toBeInstanceOf(Array);
    expect(res.body.data.baselines.length).toBeGreaterThan(0);
    expect(res.body.data.baselines[0].isLocked).toBe(true);
  });

  it('should lock a new KNOWN_GOOD_BASELINE snapshot', async () => {
    const res = await request(app)
      .post(`/api/v1/assets/${testAssetId}/baseline`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.version).toBe(2);
    expect(res.body.data.hash).toBeDefined();
  });

  it('should filter asset surface inventory by type and environment', async () => {
    const res = await request(app)
      .get('/api/v1/assets?type=CONTAINER&environment=PRODUCTION')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.every((a: any) => a.type === 'CONTAINER' && a.environment === 'PRODUCTION')).toBe(true);
  });
});
