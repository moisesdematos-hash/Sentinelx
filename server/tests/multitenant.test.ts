import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Multi-Tenant Data Isolation Enforcement', () => {
  let tokenOrgA: string;
  let tokenOrgB: string;
  let assetOrgAId: string;

  beforeAll(async () => {
    const timestamp = Date.now();

    // Register Tenant Org A
    const resA = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin Org A',
      email: `orga-${timestamp}@sentinelx.io`,
      password: 'PasswordOrgA123!',
      organizationName: `Tenant Corporation A ${timestamp}`,
    });
    tokenOrgA = resA.body.data.token;

    // Register Tenant Org B
    const resB = await request(app).post('/api/v1/auth/register').send({
      name: 'Admin Org B',
      email: `orgb-${timestamp}@sentinelx.io`,
      password: 'PasswordOrgB123!',
      organizationName: `Tenant Corporation B ${timestamp}`,
    });
    tokenOrgB = resB.body.data.token;

    // Create Asset in Org A
    const assetRes = await request(app)
      .post('/api/v1/assets')
      .set('Authorization', `Bearer ${tokenOrgA}`)
      .send({
        name: 'Confidential Internal Portal Org A',
        type: 'WEBSITE',
        target: 'https://internal-a.sentinelx.io',
        environment: 'PRODUCTION',
        criticality: 'CRITICAL',
      });

    assetOrgAId = assetRes.body.data.id;
  });

  it('should allow Org A to retrieve its created asset', async () => {
    const res = await request(app)
      .get(`/api/v1/assets/${assetOrgAId}`)
      .set('Authorization', `Bearer ${tokenOrgA}`);

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Confidential Internal Portal Org A');
  });

  it('should DENY Org B from viewing Org A asset (404/Access Denied)', async () => {
    const res = await request(app)
      .get(`/api/v1/assets/${assetOrgAId}`)
      .set('Authorization', `Bearer ${tokenOrgB}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('ASSET_NOT_FOUND');
  });

  it('should ensure Org B asset list does NOT include Org A asset', async () => {
    const res = await request(app)
      .get('/api/v1/assets')
      .set('Authorization', `Bearer ${tokenOrgB}`);

    expect(res.status).toBe(200);
    const assetIds = res.body.data.map((a: any) => a.id);
    expect(assetIds).not.toContain(assetOrgAId);
  });
});
