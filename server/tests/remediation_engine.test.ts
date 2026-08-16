import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Remediation Engine Integration Tests', () => {
  let authToken: string;
  let taskId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list pending remediation tasks with code diffs', async () => {
    const res = await request(app)
      .get('/api/v1/remediation/tasks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].codeDiff).toBeDefined();

    taskId = res.body.data[0].id;
  });

  it('should create a new automated remediation task with dry-run diff preview', async () => {
    const res = await request(app)
      .post('/api/v1/remediation/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: '[REMEDIATION] Quarantine Compromised Container Pod User Context',
        patchType: 'CONTAINER_NON_ROOT',
        target: 'k8s-pod-auth-api-7b89f',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('PENDING_APPROVAL');
    expect(res.body.data.codeDiff).toContain('appuser');
  });

  it('should approve pending remediation task', async () => {
    const res = await request(app)
      .post(`/api/v1/remediation/tasks/${taskId}/approve`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('APPROVED');
  });

  it('should execute patch and verify post-remediation status', async () => {
    const res = await request(app)
      .post(`/api/v1/remediation/tasks/${taskId}/execute`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('COMPLETED');
    expect(res.body.data.verificationStatus).toBe('VERIFIED_PASS');
  });
});
