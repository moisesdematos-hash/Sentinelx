import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './db/client.js';

const PORT = parseInt(env.PORT, 10);

const server = app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      env: env.NODE_ENV,
      url: `http://localhost:${PORT}/api/v1/health`,
    },
    '🛡️ SENTINELX Security Control Plane Server Started'
  );
});

// Graceful Shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutting down SENTINELX server gracefully...');
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
