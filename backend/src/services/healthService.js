import { env } from '../config/env.js';

export function buildHealthStatus() {
  return {
    status: 'ok',
    service: 'ai-email-manager-backend',
    environment: env.nodeEnv,
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  };
}
