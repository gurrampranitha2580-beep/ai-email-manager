import { createApp } from './app.js';
import { env, validateEnv } from './config/env.js';

validateEnv();

const app = createApp();

app.listen(env.port, () => {
  console.log(
    `Backend listening on http://localhost:${env.port} (${env.nodeEnv})`
  );
});
