import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('API-First Core & Webhooks System Integration Tests', () => {
  let authToken: string;
  let createdRawApiKey: string;
  let webhookId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should generate a new API key with sk_live_ prefix', async () => {
    const res = await request(app)
      .post('/api/v1/api-keys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'CI/CD Automation Pipeline Key',
        permissions: 'read,write,scans',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rawKey).toBeDefined();
    expect(res.body.data.rawKey).toContain('sk_live_');
    createdRawApiKey = res.body.data.rawKey;
  });

  it('should authenticate API request using X-API-Key header', async () => {
    const res = await request(app)
      .get('/api/v1/assets')
      .set('X-API-Key', createdRawApiKey);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  });

  it('should create a new Webhook subscription with HMAC secret', async () => {
    const res = await request(app)
      .post('/api/v1/webhooks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'SIEM Incident Webhook Endpoint',
        url: 'https://siem.corp.internal/webhooks/sentinelx',
        events: ['VulnerabilityDetected', 'CriticalIncidentDetected', 'SecurityScoreChanged'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.secret).toContain('whsec_');
    expect(res.body.data.events).toContain('VulnerabilityDetected');
    webhookId = res.body.data.id;
  });

  it('should dispatch a test webhook event and record delivery log', async () => {
    const testRes = await request(app)
      .post(`/api/v1/webhooks/${webhookId}/test`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(testRes.status).toBe(200);
    expect(testRes.body.success).toBe(true);

    // Retrieve webhook details and delivery logs
    const detailsRes = await request(app)
      .get(`/api/v1/webhooks/${webhookId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(detailsRes.status).toBe(200);
    expect(detailsRes.body.data.deliveryLogs.length).toBeGreaterThan(0);
    expect(detailsRes.body.data.deliveryLogs.some((l: any) => l.event === 'SecurityScoreChanged')).toBe(true);
  });
});
