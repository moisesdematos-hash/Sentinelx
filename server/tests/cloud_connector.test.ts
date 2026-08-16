import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Cloud Connectors Engine Integration Tests', () => {
  let authToken: string;
  let connectorId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should register a new AWS Cloud Connector', async () => {
    const res = await request(app)
      .post('/api/v1/cloud-connectors')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'AWS Primary Production Account',
        provider: 'AWS',
        credentials: { roleArn: 'arn:aws:iam::123456789012:role/SentinelXSecurityAuditor' },
        region: 'us-east-1',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.provider).toBe('AWS');
    connectorId = res.body.data.id;
  });

  it('should retrieve list of registered cloud connectors', async () => {
    const res = await request(app)
      .get('/api/v1/cloud-connectors')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should trigger a cloud asset discovery sync and populate asset inventory', async () => {
    const res = await request(app)
      .post(`/api/v1/cloud-connectors/${connectorId}/sync`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.discoveredAssets).toBeInstanceOf(Array);
    expect(res.body.data.discoveredAssets.length).toBeGreaterThan(0);
  });
});
