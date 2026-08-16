import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Risk Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should recalculate contextual risk profile across all assets and return weighted scores', async () => {
    const res = await request(app)
      .post('/api/v1/risk/calculate')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.organizationSecurityScore).toBeGreaterThanOrEqual(0);
    expect(res.body.data.profiles).toBeInstanceOf(Array);
  }, 15000);

  it('should retrieve Action Priority Matrix categorizing findings into P0, P1, P2, and P3 tiers', async () => {
    const res = await request(app)
      .get('/api/v1/risk/matrix')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.matrix.p0Immediate).toBeInstanceOf(Array);
    expect(res.body.data.matrix.p1High).toBeInstanceOf(Array);
    expect(res.body.data.matrix.p2Moderate).toBeInstanceOf(Array);
    expect(res.body.data.matrix.p3Low).toBeInstanceOf(Array);
  }, 15000);
});
