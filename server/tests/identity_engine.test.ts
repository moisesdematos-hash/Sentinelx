import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Zero Trust Identity Engine Integration Tests', () => {
  let authToken: string;
  let riskId: string;
  let requestId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list human and machine identity risk profiles', async () => {
    const res = await request(app)
      .get('/api/v1/identity/risks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    riskId = res.body.data[0].id;
  });

  it('should submit a Just-In-Time (JIT) temporary privilege elevation request', async () => {
    const res = await request(app)
      .post('/api/v1/identity/jit-requests')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        requesterEmail: 'devops-lead@sentinelx.io',
        requestedRole: 'JIT_PROD_DB_ACCESS',
        targetResource: 'postgres-prod-primary-01',
        durationHours: 1,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PENDING');

    requestId = res.body.data.id;
  });

  it('should approve JIT privilege elevation request', async () => {
    const res = await request(app)
      .post(`/api/v1/identity/jit-requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ approved: true });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('APPROVED');
    expect(res.body.data.expiresAt).not.toBeNull();
  });

  it('should execute emergency 1-click account lockout on a high-risk identity', async () => {
    const res = await request(app)
      .post(`/api/v1/identity/risks/${riskId}/lockout`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('LOCKED_OUT');
    expect(res.body.data.riskScore).toBe(100);
  });
});
