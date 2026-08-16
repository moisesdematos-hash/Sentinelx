import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Recovery & Rollback Engine Integration Tests', () => {
  let authToken: string;
  let sampleAssetId: string;
  let sampleBaselineId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list baseline configuration snapshots with SHA-256 integrity hashes', async () => {
    const res = await request(app)
      .get('/api/v1/recovery/baselines')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].hash).toBeDefined();

    sampleAssetId = res.body.data[0].assetId;
    sampleBaselineId = res.body.data[0].id;
  });

  it('should execute 1-click rollback restoring configuration state to baseline version', async () => {
    const res = await request(app)
      .post('/api/v1/recovery/rollback')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        assetId: sampleAssetId,
        baselineId: sampleBaselineId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('COMPLETED');
    expect(res.body.data.integrityHash).toBeDefined();
  });

  it('should trigger asset operational recovery restoring MONITORED status', async () => {
    const res = await request(app)
      .post('/api/v1/recovery/restore-asset')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        assetId: sampleAssetId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.actionType).toBe('ASSET_RESTORED');
  });

  it('should retrieve complete rollback history stream', async () => {
    const res = await request(app)
      .get('/api/v1/recovery/rollbacks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
