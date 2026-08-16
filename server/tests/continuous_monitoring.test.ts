import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Continuous Monitoring Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should trigger a continuous monitoring cycle across all assets', async () => {
    const res = await request(app)
      .post('/api/v1/monitoring/trigger')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.monitoredAssetsCount).toBeGreaterThan(0);
    expect(res.body.data.telemetryPointsRecorded).toBeGreaterThan(0);
  }, 25000);

  it('should retrieve real-time monitoring telemetry feed', async () => {
    const res = await request(app)
      .get('/api/v1/monitoring/telemetry')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].metricType).toBeDefined();
  }, 15000);

  it('should return continuous monitoring scheduler health status', async () => {
    const res = await request(app)
      .get('/api/v1/monitoring/status')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ONLINE');
    expect(res.body.data.mode).toBe('CONTINUOUS_AUTOMATED_DEFENSE');
  }, 15000);
});
