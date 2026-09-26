import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().default('file:./sentinelx.db'),
  JWT_SECRET: z.string().min(16, 'JWT Secret must be at least 16 characters long'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  LOG_LEVEL: z.string().default('info'),
  SUPABASE_URL: z.string().optional().default('https://rkmoizysggjcdowpldcz.supabase.co'),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional().default('sb_publishable_NCHGz1hCJZe-i_vm4O1FGQ__b2_Cdee'),
  SUPABASE_SECRET_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment configuration:', parsed.error.format());
  throw new Error('Environment configuration validation failed.');
}

export const env = parsed.data;
