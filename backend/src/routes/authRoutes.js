import { Router } from 'express';

import {
  disconnect,
  getMe,
  getStatus,
  googleCallback,
  logout,
  startGoogleAuth,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/auth/google', authLimiter, startGoogleAuth);
router.get('/auth/google/callback', authLimiter, googleCallback);
router.get('/auth/me', requireAuth, getMe);
router.get('/auth/status', requireAuth, getStatus);
router.post('/auth/logout', requireAuth, logout);
router.post('/auth/disconnect', requireAuth, disconnect);

export default router;
