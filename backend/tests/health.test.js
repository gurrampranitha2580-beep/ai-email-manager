import test from 'node:test';
import assert from 'node:assert/strict';

import { createApp } from '../src/app.js';

function startServer() {
  const app = createApp();
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('GET /api/health returns ok', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.equal(body.success, true);
    assert.equal(body.data.status, 'ok');
  } finally {
    server.close();
  }
});

test('unknown API route returns a structured 404 error', async () => {
  const server = await startServer();
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/does-not-exist`);
    assert.equal(response.status, 404);

    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.error.code, 'NOT_FOUND');
  } finally {
    server.close();
  }
});
