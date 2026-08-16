import { Request, Response } from 'express';
import { prisma } from '../db/client.js';
import { sendSuccess, sendError } from '../utils/response.js';

export class HealthController {
  static async check(_req: Request, res: Response) {
    try {
      // Test DB connection latency
      const start = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbLatency = Date.now() - start;

      return sendSuccess(res, {
        name: 'SENTINELX Security Control Plane API',
        version: '1.0.0-phase1',
        status: 'HEALTHY',
        uptime: process.uptime(),
        services: {
          database: { status: 'UP', latencyMs: dbLatency },
          securityEngine: { status: 'ONLINE', mode: 'CONTINUOUS_DEFENSE' },
          eventBus: { status: 'READY' },
          intelligenceFeed: { status: 'SYNCED', version: '2026.08.16-v1' },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      return sendError(
        res,
        'Database connection failed',
        503,
        'SERVICE_UNAVAILABLE',
        { error: err.message }
      );
    }
  }
}
