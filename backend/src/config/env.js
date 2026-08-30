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
  mongodbUri: process.env.MONGODB_URI || '',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_REDIRECT_URI ||
      'http://localhost:5000/api/auth/google/callback',
  },
  sessionSecret: process.env.SESSION_SECRET || '',
  tokenEncryptionKey: process.env.TOKEN_ENCRYPTION_KEY || '',
};

export const isProduction = env.nodeEnv === 'production';

const REQUIRED_VARS = [
  ['MONGODB_URI', env.mongodbUri],
  ['GOOGLE_CLIENT_ID', env.google.clientId],
  ['GOOGLE_CLIENT_SECRET', env.google.clientSecret],
  ['SESSION_SECRET', env.sessionSecret],
  ['TOKEN_ENCRYPTION_KEY', env.tokenEncryptionKey],
];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter(([, value]) => !value).map(
    ([name]) => name
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        'Copy backend/.env.example to backend/.env and fill in the values.'
    );
  }

  return env;
}
