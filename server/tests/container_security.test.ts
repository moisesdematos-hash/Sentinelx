import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Container Security Engine Integration Tests', () => {
  let authToken: string;
  let containerAssetId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;

    // Create Container Asset
    const assetRes = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'SentinelX Core Microservice Image',
        type: 'CONTAINER',
        target: 'docker.io/sentinelx/core-service:v1.2.0',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
      });

    containerAssetId = assetRes.body.data.id;
  });

  it('should execute a container security scan and return image layer CVEs, runtime security, and K8s PSS metrics', async () => {
    const res = await request(app)
      .post('/api/v1/scans/container')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ assetId: containerAssetId });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(90);
    expect(res.body.data.imageDigest).toBeDefined();
    expect(res.body.data.vulnerabilityStatus).toBeInstanceOf(Array);
    expect(res.body.data.runtimeStatus.runsAsRoot).toBe(false);
    expect(res.body.data.k8sStatus.pssLevel).toBe('RESTRICTED');
  });

  it('should retrieve container scan history for a specific container asset', async () => {
    const res = await request(app)
      .get(`/api/v1/scans/container/${containerAssetId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].vulnerabilityStatus).toBeInstanceOf(Array);
  });
});
