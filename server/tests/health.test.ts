import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/v1/health', () => {
  it('should return 200 OK with health details', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toContain('SENTINELX');
    expect(res.body.data.status).toBe('HEALTHY');
    expect(res.body.data.services.securityEngine.mode).toBe('CONTINUOUS_DEFENSE');
  });
});
