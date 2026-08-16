import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Threat Intelligence Feed Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should trigger threat intelligence feed synchronization cycle', async () => {
    const res = await request(app)
      .post('/api/v1/threat-intel/sync')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.syncedFeedsCount).toBeGreaterThan(0);
    expect(res.body.data.indicatorsIngested).toBeGreaterThan(0);
  });

  it('should list ingested threat indicators with severity and confidence scores', async () => {
    const res = await request(app)
      .get('/api/v1/threat-intel/indicators')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].confidenceScore).toBeDefined();
  });

  it('should list matched IOC indicators affecting organization infrastructure', async () => {
    const res = await request(app)
      .get('/api/v1/threat-intel/matches')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
