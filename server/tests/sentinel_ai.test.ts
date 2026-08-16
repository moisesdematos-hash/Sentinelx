import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Sentinel AI Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should process user conversational cyber query and return AI co-pilot guidance', async () => {
    const res = await request(app)
      .post('/api/v1/sentinel-ai/chat')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        prompt: 'How do I fix CVE-2024-3094 on Alpine Linux?',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.response).toContain('CVE-2024-3094');
  });

  it('should generate automated Root Cause Analysis and remediation code snippet', async () => {
    const res = await request(app)
      .post('/api/v1/sentinel-ai/analyze')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        targetType: 'VULNERABILITY',
        targetId: 'vuln-sample-101',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.rootCause).toBeDefined();
    expect(res.body.data.codeSnippet).toBeDefined();
    expect(res.body.data.confidenceScore).toBe(98);
  });

  it('should retrieve list of generated AI recommendations', async () => {
    const res = await request(app)
      .get('/api/v1/sentinel-ai/recommendations')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
