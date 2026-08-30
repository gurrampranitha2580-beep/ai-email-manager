import { env, isProduction } from '../config/env.js';
import { AppError, ERROR_CODES } from '../middleware/errorHandler.js';
import {
  OAUTH_STATE_COOKIE,
  SESSION_COOKIE,
  createAuthUrl,
  createSessionToken,
  disconnectGmail,
  getConnectionStatus,
  handleGoogleCallback,
  sessionCookieOptions,
} from '../services/authService.js';

export function startGoogleAuth(req, res) {
  const { url, state } = createAuthUrl();

  res.cookie(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 10 * 60 * 1000,
    path: '/',
  });

  res.redirect(url);
}

export async function googleCallback(req, res, next) {
  const failureRedirect = (reason) =>
    res.redirect(`${env.clientUrl}/login?error=${reason}`);

  try {
    const { code, state, error } = req.query;

    if (error) {
      return failureRedirect('access_denied');
    }

    const expectedState = req.cookies?.[OAUTH_STATE_COOKIE];
    res.clearCookie(OAUTH_STATE_COOKIE, { path: '/' });

    if (!state || !expectedState || state !== expectedState) {
      return failureRedirect('invalid_state');
    }

    if (!code) {
      return failureRedirect('missing_code');
    }

    const user = await handleGoogleCallback(code);
    res.cookie(SESSION_COOKIE, createSessionToken(user), sessionCookieOptions());

    return res.redirect(`${env.clientUrl}/dashboard`);
  } catch (err) {
    if (err instanceof AppError && err.code === ERROR_CODES.GOOGLE_AUTH_FAILED) {
      return failureRedirect('google_auth_failed');
    }
    return next(err);
  }
}

export function getMe(req, res) {
  res.json({ success: true, data: { user: req.user.toPublicJSON() } });
}

export async function getStatus(req, res, next) {
  try {
    const connection = await getConnectionStatus(req.user._id);
    res.json({
      success: true,
      data: {
        authenticated: true,
        user: req.user.toPublicJSON(),
        gmail: connection,
      },
    });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie(SESSION_COOKIE, { ...sessionCookieOptions(0), maxAge: undefined });
  res.json({ success: true, data: { loggedOut: true } });
}

export async function disconnect(req, res, next) {
  try {
    const result = await disconnectGmail(req.user._id);
    res.json({ success: true, data: { gmail: result } });
  } catch (error) {
    next(error);
  }
}
