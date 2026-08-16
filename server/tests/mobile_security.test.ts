import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Mobile Security & App Audit Engine Integration Tests', () => {
  let authToken: string;
  let scanId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list mobile application security scan history', async () => {
    const res = await request(app)
      .get('/api/v1/mobile-security/scans')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    scanId = res.body.data[0].id;
  });

  it('should trigger real-time mobile APK/IPA binary security audit', async () => {
    const res = await request(app)
      .post('/api/v1/mobile-security/scans')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ packageName: 'com.sentinelx.mobile.v2', platform: 'ANDROID_APK' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.score).toBeGreaterThan(80);
    expect(res.body.data.status).toBe('COMPLETED');
  });

  it('should retrieve full OWASP MASVS audit & secret findings report', async () => {
    const res = await request(app)
      .get(`/api/v1/mobile-security/scans/${scanId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.masvsStatus).toBeDefined();
    expect(res.body.data.hardcodedSecrets).toBeDefined();
  });
});
