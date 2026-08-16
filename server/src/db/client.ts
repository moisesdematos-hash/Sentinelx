import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

export const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' },
    { emit: 'stdout', level: 'info' },
    { emit: 'stdout', level: 'warn' },
  ],
});

prisma.$on('query' as never, (e: any) => {
  if (process.env.LOG_QUERIES === 'true') {
    logger.debug({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'DB Query');
  }
});
