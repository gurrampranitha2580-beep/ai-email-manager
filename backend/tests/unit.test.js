import test from 'node:test';
import assert from 'node:assert/strict';

process.env.TOKEN_ENCRYPTION_KEY =
  process.env.TOKEN_ENCRYPTION_KEY || 'test-encryption-key';

const { encrypt, decrypt } = await import('../src/utils/encryption.js');
const { buildSearchQuery } = await import('../src/services/emailService.js');
const { parseAddress, parseMessageSummary } = await import(
  '../src/utils/gmailParser.js'
);

test('encrypt/decrypt round-trips a token and does not store plaintext', () => {
  const token = 'ya29.super-secret-access-token';
  const encrypted = encrypt(token);

  assert.notEqual(encrypted, token);
  assert.ok(!encrypted.includes(token));
  assert.equal(decrypt(encrypted), token);
});

test('decrypt rejects a malformed payload', () => {
  assert.throws(() => decrypt('not-a-valid-payload'));
});

test('buildSearchQuery maps fields to Gmail syntax', () => {
  assert.equal(buildSearchQuery({ q: 'invoice' }), 'invoice');
  assert.equal(
    buildSearchQuery({ q: 'boss@example.com', field: 'from' }),
    'from:boss@example.com'
  );
  assert.equal(buildSearchQuery({ q: '   ' }), '');
});

test('parseAddress splits a display name from an email address', () => {
  assert.deepEqual(parseAddress('Jane Doe <jane@example.com>'), {
    name: 'Jane Doe',
    email: 'jane@example.com',
  });
  assert.deepEqual(parseAddress('jane@example.com'), {
    name: 'jane@example.com',
    email: 'jane@example.com',
  });
});

test('parseMessageSummary reads headers and label flags', () => {
  const summary = parseMessageSummary({
    id: 'm1',
    threadId: 't1',
    snippet: 'hello',
    internalDate: '1700000000000',
    labelIds: ['INBOX', 'UNREAD', 'STARRED'],
    payload: {
      headers: [
        { name: 'From', value: 'Jane <jane@example.com>' },
        { name: 'Subject', value: 'Hi there' },
      ],
    },
  });

  assert.equal(summary.subject, 'Hi there');
  assert.equal(summary.from.email, 'jane@example.com');
  assert.equal(summary.isUnread, true);
  assert.equal(summary.isStarred, true);
});
