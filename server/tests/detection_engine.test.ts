import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Detection Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list active threat detection rules including default Sigma/YARA rules', async () => {
    const res = await request(app)
      .get('/api/v1/detection/rules')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].status).toBe('ENABLED');
  });

  it('should create a custom threat detection rule', async () => {
    const res = await request(app)
      .post('/api/v1/detection/rules')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Anomalous Kubernetes ServiceAccount Token Access',
        description: 'Detects unauthorized service account token extraction from k8s pod secrets.',
        severity: 'HIGH',
        category: 'PRIVILEGE_ESCALATION',
        ruleCondition: { targetFile: '/var/run/secrets/kubernetes.io/serviceaccount/token' },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Anomalous Kubernetes ServiceAccount Token Access');
  });

  it('should evaluate recent security events against detection rules and generate detection alerts', async () => {
    // First publish a critical event to trigger rule matching
    await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        eventType: 'ThreatDetected',
        sourceEngine: 'SERVER',
        severity: 'CRITICAL',
        payload: { fileModified: '/etc/sudoers', alert: 'Root privilege escalation' },
      });

    const res = await request(app)
      .post('/api/v1/detection/evaluate')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.evaluatedRulesCount).toBeGreaterThan(0);
  });

  it('should retrieve list of generated threat detection alerts', async () => {
    const res = await request(app)
      .get('/api/v1/detection/alerts')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
