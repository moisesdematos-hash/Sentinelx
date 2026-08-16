import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Microsegmentation Engine Integration Tests', () => {
  let authToken: string;
  let segmentId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list configured network security segments', async () => {
    const res = await request(app)
      .get('/api/v1/microsegmentation/segments')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    segmentId = res.body.data[0].id;
  });

  it('should create a custom microsegmentation network segment', async () => {
    const res = await request(app)
      .post('/api/v1/microsegmentation/segments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Database Core East-West Perimeter',
        environment: 'PRODUCTION',
        isolationLevel: 'STRICT_ZERO_TRUST',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isolationLevel).toBe('STRICT_ZERO_TRUST');
  });

  it('should add a granular policy flow rule to a segment', async () => {
    const res = await request(app)
      .post(`/api/v1/microsegmentation/segments/${segmentId}/rules`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        sourceTag: 'role:untrusted-workstation',
        targetTag: 'role:db-master',
        protocol: 'TCP',
        portRange: '5432',
        action: 'DENY',
        description: 'Deny untrusted workstations access to DB Master',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.action).toBe('DENY');
  });

  it('should enforce STRICT_ZERO_TRUST isolation on a network segment', async () => {
    const res = await request(app)
      .post(`/api/v1/microsegmentation/segments/${segmentId}/enforce`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ENFORCED');
    expect(res.body.data.isolationLevel).toBe('STRICT_ZERO_TRUST');
  });

  it('should retrieve blocked East-West traffic flow logs', async () => {
    const res = await request(app)
      .get('/api/v1/microsegmentation/logs')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
