import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Autopilot Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list pre-seeded autonomous defense policies', async () => {
    const res = await request(app)
      .get('/api/v1/autopilot/policies')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should execute autonomous self-defense evaluation and return action records', async () => {
    const res = await request(app)
      .post('/api/v1/autopilot/execute')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.evaluatedPoliciesCount).toBeGreaterThan(0);
    expect(res.body.data.actions).toBeInstanceOf(Array);
  });

  it('should retrieve autonomous execution stream log', async () => {
    const res = await request(app)
      .get('/api/v1/autopilot/actions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should engage emergency kill switch pausing all policies', async () => {
    const res = await request(app)
      .post('/api/v1/autopilot/kill-switch')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.actionType).toBe('EMERGENCY_KILL_SWITCH');
  });
});
