import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Event Bus Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should publish a security event to the central event bus', async () => {
    const res = await request(app)
      .post('/api/v1/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        eventType: 'CriticalIncidentDetected',
        sourceEngine: 'SERVER',
        severity: 'CRITICAL',
        payload: { alert: 'Unauthorized root escalation detected', pid: 9912 },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.eventType).toBe('CriticalIncidentDetected');
    expect(res.body.data.severity).toBe('CRITICAL');
  });

  it('should retrieve filtered security events list', async () => {
    const res = await request(app)
      .get('/api/v1/events?severity=CRITICAL')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0].severity).toBe('CRITICAL');
  });
});
