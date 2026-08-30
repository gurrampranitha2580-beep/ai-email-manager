import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env, validateEnv } from './config/env.js';

async function start() {
  validateEnv();
  await connectDatabase();

  const app = createApp();

  app.listen(env.port, () => {
    console.log(
      `Backend listening on http://localhost:${env.port} (${env.nodeEnv})`
    );
  });
}

start().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});
