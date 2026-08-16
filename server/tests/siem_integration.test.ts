import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('SIEM Integration Engine Integration Tests', () => {
  let authToken: string;
  let siemId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list configured SIEM integrations', async () => {
    const res = await request(app)
      .get('/api/v1/siem/integrations')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    siemId = res.body.data[0].id;
  });

  it('should create a new Datadog SIEM sink integration with CEF log format', async () => {
    const res = await request(app)
      .post('/api/v1/siem/integrations')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Datadog Enterprise Security Monitoring Sink',
        provider: 'DATADOG',
        endpointUrl: 'https://http-intake.logs.datadoghq.com/v1/input',
        apiKey: 'dd_api_key_live_99281726',
        logFormat: 'CEF',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.provider).toBe('DATADOG');
    expect(res.body.data.logFormat).toBe('CEF');
  });

  it('should dispatch test event stream to SIEM target and log delivery', async () => {
    const res = await request(app)
      .post(`/api/v1/siem/integrations/${siemId}/test`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('DELIVERED');
    expect(res.body.data.payload).toContain('CEF:0|SENTINELX');
  });

  it('should retrieve real-time log forwarding stream logs', async () => {
    const res = await request(app)
      .get('/api/v1/siem/logs')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
