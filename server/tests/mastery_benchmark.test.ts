import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Final Mastery Benchmark & Production Readiness Assessment Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should retrieve full 38-phase platform mastery benchmark & 100% readiness assessment', async () => {
    const res = await request(app)
      .get('/api/v1/mastery-benchmark')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.readinessScore).toBe(100.0);
    expect(res.body.data.totalRoadmapPhases).toBe(38);
    expect(res.body.data.completedRoadmapPhases).toBe(38);
    expect(res.body.data.certificationSeal).toBe('SENTINELX_AUTONOMOUS_ENTERPRISE_CERTIFIED');
    expect(res.body.data.phases).toBeInstanceOf(Array);
    expect(res.body.data.phases.length).toBe(38);
  });
});
