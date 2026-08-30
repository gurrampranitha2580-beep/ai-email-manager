import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export const isProduction = env.nodeEnv === 'production';

export function validateEnv() {
  const missing = [];

  if (!process.env.CLIENT_URL) {
    missing.push('CLIENT_URL');
  }

  if (missing.length > 0) {
    // Phase 1 only needs a client origin for CORS; fall back with a warning
    // instead of refusing to start during local development.
    console.warn(
      `Missing environment variables (using defaults): ${missing.join(', ')}`
    );
  }

  return env;
}
