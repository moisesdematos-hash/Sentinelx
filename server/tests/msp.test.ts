import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('MSP / MSSP Partner Control Center API', () => {
  let partnerToken: string;

  beforeAll(async () => {
    // Authenticate as default seeded SUPER_ADMIN
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    partnerToken = loginRes.body.data.token;
  });

  it('should retrieve portfolio summary analytics and client risk ranking', async () => {
    const res = await request(app)
      .get('/api/v1/msp/summary')
      .set('Authorization', `Bearer ${partnerToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.portfolioMetrics).toBeDefined();
    expect(res.body.data.portfolioMetrics.totalClients).toBeGreaterThanOrEqual(4);
    expect(res.body.data.clientRiskRanking).toBeInstanceOf(Array);
  });

  it('should onboard a new client organization under MSP portfolio', async () => {
    const res = await request(app)
      .post('/api/v1/msp/clients')
      .set('Authorization', `Bearer ${partnerToken}`)
      .send({
        name: 'Omni Retail Group',
        domain: 'omniretail.com',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Omni Retail Group');
    expect(res.body.data.securityScore).toBe(100);
  });

  it('should update white-label partner branding settings', async () => {
    const res = await request(app)
      .post('/api/v1/msp/branding')
      .set('Authorization', `Bearer ${partnerToken}`)
      .send({
        brandName: 'CyberDefense SOC Enterprise',
        logoUrl: 'https://cdn.sentinelx.io/brand/logo.png',
        primaryColor: '#00f2fe',
        supportEmail: 'soc@cyberdefense.io',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.brandName).toBe('CyberDefense SOC Enterprise');
  });
});
