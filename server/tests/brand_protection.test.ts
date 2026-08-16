import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Brand Protection & Domain Impersonation Engine Integration Tests', () => {
  let authToken: string;
  let domainId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list discovered typosquatting and impersonation domains', async () => {
    const res = await request(app)
      .get('/api/v1/brand-protection/domains')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    domainId = res.body.data[0].id;
  });

  it('should trigger real-time domain impersonation discovery scan', async () => {
    const res = await request(app)
      .post('/api/v1/brand-protection/scan')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ targetDomain: 'sentinelx.io' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should submit 1-click registrar abuse takedown request', async () => {
    const res = await request(app)
      .post(`/api/v1/brand-protection/domains/${domainId}/takedown`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('TAKEDOWN_SUBMITTED');
  });

  it('should list dark web leaked credentials and brand findings', async () => {
    const res = await request(app)
      .get('/api/v1/brand-protection/leaks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
