import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Edge & IoT Security Engine Integration Tests', () => {
  let authToken: string;
  let nodeId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list registered edge compute nodes and IoT gateways', async () => {
    const res = await request(app)
      .get('/api/v1/edge-security/nodes')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    nodeId = res.body.data[0].id;
  });

  it('should trigger real-time edge security and IoT firmware audit', async () => {
    const res = await request(app)
      .post('/api/v1/edge-security/scan')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should execute 1-click edge DDoS mitigation WAF rule', async () => {
    const res = await request(app)
      .post(`/api/v1/edge-security/nodes/${nodeId}/ddos-mitigate`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('MITIGATED');
    expect(res.body.data.trafficRps).toBe(250);
  });

  it('should list IoT firmware & MQTT protocol audit scans', async () => {
    const res = await request(app)
      .get('/api/v1/edge-security/iot-scans')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
