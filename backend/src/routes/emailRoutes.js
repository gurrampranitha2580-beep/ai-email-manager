import { Router } from 'express';
import { param, query } from 'express-validator';

import {
  getEmail,
  getUnreadCount,
  listInbox,
  searchEmails,
} from '../controllers/emailController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validation.js';

const router = Router();

const messageIdRule = param('id')
  .isString()
  .trim()
  .matches(/^[A-Za-z0-9_-]{1,128}$/)
  .withMessage('Invalid message id.');

router.get(
  '/emails',
  requireAuth,
  query('maxResults').optional().isInt({ min: 1, max: 50 }),
  handleValidation,
  listInbox
);

router.get(
  '/emails/search',
  requireAuth,
  query('q').isString().trim().isLength({ min: 1, max: 200 }),
  query('field').optional().isIn(['from', 'to', 'subject', '']),
  query('maxResults').optional().isInt({ min: 1, max: 50 }),
  handleValidation,
  searchEmails
);

router.get('/emails/unread-count', requireAuth, getUnreadCount);

router.get('/emails/:id', requireAuth, messageIdRule, handleValidation, getEmail);

export default router;
