import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Global Threat Intelligence Exchange Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list anonymized global threat indicators', async () => {
    const res = await request(app)
      .get('/api/v1/threat-exchange/indicators')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should publish anonymized threat indicator to global exchange with SHA-256 node hash', async () => {
    const res = await request(app)
      .post('/api/v1/threat-exchange/share')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        indicatorType: 'IP',
        indicatorValue: '194.26.29.112',
        threatCategory: 'BOTNET',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.anonymousNodeHash).toBeDefined();
    expect(res.body.data.confidenceScore).toBe(99);
  });

  it('should sync collective threat blocklist into WAF & firewall rules', async () => {
    const res = await request(app)
      .post('/api/v1/threat-exchange/sync-blocklist')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.syncedCount).toBeGreaterThan(0);
  });
});
