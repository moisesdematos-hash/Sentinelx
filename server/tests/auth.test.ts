import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Auth Endpoints API', () => {
  const testEmail = `testsec-${Date.now()}@sentinelx.io`;

  it('should register a new organization and admin user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        name: 'SecOps Lead',
        email: testEmail,
        password: 'SecurePassword123!',
        organizationName: 'Alpha Defense Org',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testEmail);
    expect(res.body.data.user.role).toBe('ORG_ADMIN');
  });

  it('should authenticate user with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'SecurePassword123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });

  it('should reject authentication with invalid password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testEmail,
        password: 'WrongPassword!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });
});
