import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Cloud Security Posture Engine (CSPM) Integration Tests', () => {
  let authToken: string;
  let connectorId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;

    // Create Cloud Connector
    const connRes = await request(app)
      .post('/api/v1/cloud-connectors')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'AWS Primary CSPM Target',
        provider: 'AWS',
        credentials: { roleArn: 'arn:aws:iam::123456789012:role/SentinelXCspmAuditor' },
        region: 'us-east-1',
      });

    connectorId = connRes.body.data.id;
  });

  it('should execute a CSPM posture scan and return storage, IAM, network, and logging metrics', async () => {
    const res = await request(app)
      .post(`/api/v1/cloud-connectors/${connectorId}/cspm-scan`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThanOrEqual(90);
    expect(res.body.data.storageStatus).toBeInstanceOf(Array);
    expect(res.body.data.iamStatus.rootMfaEnabled).toBe(true);
    expect(res.body.data.loggingStatus.cloudTrailMultiRegionEnabled).toBe(true);
  });

  it('should retrieve historical CSPM posture scans for a specific cloud connector', async () => {
    const res = await request(app)
      .get(`/api/v1/cloud-connectors/${connectorId}/cspm-scan`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].networkStatus).toBeInstanceOf(Array);
  });
});
