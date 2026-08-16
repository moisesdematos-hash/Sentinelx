import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Autonomous Self-Healing & Code Auto-Fix Engine Integration Tests', () => {
  let authToken: string;
  let patchId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list self-healing code auto-fix patches', async () => {
    const res = await request(app)
      .get('/api/v1/self-healing/patches')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    patchId = res.body.data[0].id;
  });

  it('should synthesize a generative code auto-fix patch and calculate CI/CD safety score', async () => {
    const res = await request(app)
      .post('/api/v1/self-healing/patches')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Fix Insecure CORS Configuration in Server Entrypoint',
        targetFile: 'server/src/app.ts',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.codeDiff).toBeDefined();
    expect(res.body.data.safetyScore).toBeGreaterThan(90);
  });

  it('should apply self-healing patch and open automated Git Pull Request', async () => {
    const res = await request(app)
      .post(`/api/v1/self-healing/patches/${patchId}/apply`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('APPLIED');
  });
});
