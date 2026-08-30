import { AppError, ERROR_CODES } from './errorHandler.js';
import {
  SESSION_COOKIE,
  getUserById,
  verifySessionToken,
} from '../services/authService.js';

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[SESSION_COOKIE];

    if (!token) {
      throw new AppError(
        ERROR_CODES.AUTH_REQUIRED,
        'You need to sign in to continue.',
        401
      );
    }

    const payload = verifySessionToken(token);
    req.user = await getUserById(payload.sub);
    next();
  } catch (error) {
    next(error);
  }
}
