import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import v1Router from './routes/v1/index.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { env } from './config/env.js';

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: false, // Managed at gateway/frontend level
}));

// CORS Configuration
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP, please try again later.',
    },
  },
});
app.use('/api/', limiter);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API V1 Router
app.use('/api/v1', v1Router);

// Global Error Handler
app.use(errorMiddleware);

export default app;
