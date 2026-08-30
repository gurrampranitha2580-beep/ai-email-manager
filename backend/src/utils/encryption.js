import crypto from 'node:crypto';

import { env } from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;

function getKey() {
  const key = env.tokenEncryptionKey;

  if (!key) {
    throw new Error('TOKEN_ENCRYPTION_KEY is not configured.');
  }

  // Accept either a 64-char hex key or any passphrase (hashed to 32 bytes).
  if (/^[0-9a-f]{64}$/i.test(key)) {
    return Buffer.from(key, 'hex');
  }

  return crypto.createHash('sha256').update(key).digest();
}

export function encrypt(plainText) {
  if (plainText === undefined || plainText === null || plainText === '') {
    return '';
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(String(plainText), 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString('base64'),
    authTag.toString('base64'),
    encrypted.toString('base64'),
  ].join('.');
}

export function decrypt(payload) {
  if (!payload) {
    return '';
  }

  const [ivPart, tagPart, dataPart] = String(payload).split('.');

  if (!ivPart || !tagPart || !dataPart) {
    throw new Error('Encrypted payload is malformed.');
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivPart, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tagPart, 'base64'));

  return Buffer.concat([
    decipher.update(Buffer.from(dataPart, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}
