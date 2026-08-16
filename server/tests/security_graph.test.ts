import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Security Graph Engine Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'admin@sentinelx.io',
      password: 'Admin@SentinelX2026',
    });

    authToken = loginRes.body.data.token;
  });

  it('should retrieve security graph topology nodes and directed relationships', async () => {
    const res = await request(app)
      .get('/api/v1/graph/topology')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nodes).toBeInstanceOf(Array);
    expect(res.body.data.edges).toBeInstanceOf(Array);
    expect(res.body.data.nodes.length).toBeGreaterThan(0);
  }, 30000);

  it('should discover multi-hop attack paths', async () => {
    const res = await request(app)
      .get('/api/v1/graph/attack-paths')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeInstanceOf(Array);
  }, 30000);

  it('should calculate blast radius score and reachable nodes for a target node', async () => {
    const topoRes = await request(app)
      .get('/api/v1/graph/topology')
      .set('Authorization', `Bearer ${authToken}`);

    const targetNodeId = topoRes.body.data.nodes[0].id;

    const res = await request(app)
      .get(`/api/v1/graph/blast-radius/${targetNodeId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.blastRadiusScore).toBeDefined();
    expect(res.body.data.reachableNodesCount).toBeDefined();
  }, 30000);
});
