import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('SOAR Automated Response Engine Integration Tests', () => {
  let authToken: string;
  let playbookId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list configured SOAR playbooks', async () => {
    const res = await request(app)
      .get('/api/v1/soar/playbooks')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    playbookId = res.body.data[0].id;
  });

  it('should create a custom multi-step SOAR orchestration playbook', async () => {
    const res = await request(app)
      .post('/api/v1/soar/playbooks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '[SOAR] Custom Zero-Trust Isolation Workflow',
        triggerCondition: 'P0_RANSOMWARE_DETECTED',
        executionMode: 'AUTOMATIC',
        actionSteps: [
          { stepOrder: 1, action: 'BLOCK_IP', description: 'Block source IP' },
          { stepOrder: 2, action: 'REVOKE_TOKEN', description: 'Revoke JWT session' },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.executionMode).toBe('AUTOMATIC');
  });

  it('should trigger multi-step playbook execution and record step outcomes', async () => {
    const res = await request(app)
      .post(`/api/v1/soar/playbooks/${playbookId}/trigger`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ targetResource: 'prod-k8s-pod-auth-api-882a' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('SUCCESS');
    expect(res.body.data.stepResults).toContain('executed successfully');
  });

  it('should retrieve playbook execution history stream', async () => {
    const res = await request(app)
      .get('/api/v1/soar/executions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
