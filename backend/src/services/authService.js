import crypto from 'node:crypto';

import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

import { env, isProduction } from '../config/env.js';
import { User } from '../models/User.js';
import { CONNECTION_STATUS, GmailConnection } from '../models/GmailConnection.js';
import { encrypt } from '../utils/encryption.js';
import { AppError, ERROR_CODES } from '../middleware/errorHandler.js';

export const SESSION_COOKIE = 'app_session';
export const OAUTH_STATE_COOKIE = 'oauth_state';

export const GOOGLE_SCOPES = [
  'openid',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
];

export function createOAuthClient() {
  return new google.auth.OAuth2(
    env.google.clientId,
    env.google.clientSecret,
    env.google.redirectUri
  );
}

export function createAuthUrl() {
  const state = crypto.randomBytes(16).toString('hex');
  const url = createOAuthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: true,
    scope: GOOGLE_SCOPES,
    state,
  });

  return { url, state };
}

export function sessionCookieOptions(maxAgeMs = 7 * 24 * 60 * 60 * 1000) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: maxAgeMs,
    path: '/',
  };
}

export function createSessionToken(user) {
  return jwt.sign({ sub: user._id.toString() }, env.sessionSecret, {
    expiresIn: '7d',
  });
}

export function verifySessionToken(token) {
  try {
    return jwt.verify(token, env.sessionSecret);
  } catch {
    throw new AppError(
      ERROR_CODES.AUTH_REQUIRED,
      'Your session has expired. Please sign in again.',
      401
    );
  }
}

async function fetchGoogleProfile(oauthClient) {
  const oauth2 = google.oauth2({ version: 'v2', auth: oauthClient });
  const { data } = await oauth2.userinfo.get();

  if (!data.id || !data.email) {
    throw new AppError(
      ERROR_CODES.GOOGLE_AUTH_FAILED,
      'Google did not return the account information we need.',
      502
    );
  }

  return data;
}

export async function handleGoogleCallback(code) {
  const oauthClient = createOAuthClient();

  let tokens;
  try {
    ({ tokens } = await oauthClient.getToken(code));
  } catch {
    throw new AppError(
      ERROR_CODES.GOOGLE_AUTH_FAILED,
      'Could not complete Google sign-in. Please try again.',
      401
    );
  }

  oauthClient.setCredentials(tokens);
  const profile = await fetchGoogleProfile(oauthClient);

  const user = await User.findOneAndUpdate(
    { googleId: profile.id },
    {
      googleId: profile.id,
      email: profile.email,
      name: profile.name || profile.email,
      profilePicture: profile.picture || '',
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const existing = await GmailConnection.findOne({ userId: user._id }).select(
    '+encryptedRefreshToken'
  );

  const update = {
    userId: user._id,
    googleAccountEmail: profile.email,
    encryptedAccessToken: encrypt(tokens.access_token || ''),
    tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
    scopes: (tokens.scope || '').split(' ').filter(Boolean),
    status: CONNECTION_STATUS.CONNECTED,
  };

  // Google only returns a refresh token on the first consent; keep the stored one otherwise.
  if (tokens.refresh_token) {
    update.encryptedRefreshToken = encrypt(tokens.refresh_token);
  } else if (existing?.encryptedRefreshToken) {
    update.encryptedRefreshToken = existing.encryptedRefreshToken;
  }

  await GmailConnection.findOneAndUpdate({ userId: user._id }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return user;
}

export async function getUserById(userId) {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(
      ERROR_CODES.AUTH_REQUIRED,
      'Your session is no longer valid. Please sign in again.',
      401
    );
  }

  return user;
}

export async function getConnectionStatus(userId) {
  const connection = await GmailConnection.findOne({ userId });

  if (!connection) {
    return { connected: false, status: CONNECTION_STATUS.DISCONNECTED };
  }

  return {
    connected: connection.status === CONNECTION_STATUS.CONNECTED,
    ...connection.toPublicJSON(),
  };
}

export async function disconnectGmail(userId) {
  await GmailConnection.deleteOne({ userId });
  return { connected: false, status: CONNECTION_STATUS.DISCONNECTED };
}
