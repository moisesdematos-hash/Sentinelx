import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Server Security Engine Integration Tests', () => {
  let authToken: string;
  let serverAssetId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;

    // Create Server Asset
    const assetRes = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Detection Node Primary Ubuntu',
        type: 'SERVER',
        target: '10.100.4.15 (us-east-1)',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
      });

    serverAssetId = assetRes.body.data.id;
  });

  it('should execute a server security scan and return FIM, process, and listening port metrics', async () => {
    const res = await request(app)
      .post('/api/v1/scans/server')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ assetId: serverAssetId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(90);
    expect(res.body.data.fimStatus).toBeInstanceOf(Array);
    expect(res.body.data.fimStatus.some((f: any) => f.path === '/etc/passwd')).toBe(true);
    expect(res.body.data.servicesStatus.some((s: any) => s.port === 22)).toBe(true);
  });

  it('should retrieve server scan history for a specific server asset', async () => {
    const res = await request(app)
      .get(`/api/v1/scans/server/${serverAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].processStatus).toBeInstanceOf(Array);
  });
});
