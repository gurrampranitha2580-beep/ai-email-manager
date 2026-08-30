import { Router } from 'express';
import { param } from 'express-validator';

import { getThread } from '../controllers/threadController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validation.js';

const router = Router();

router.get(
  '/threads/:threadId',
  requireAuth,
  param('threadId')
    .isString()
    .trim()
    .matches(/^[A-Za-z0-9_-]{1,128}$/)
    .withMessage('Invalid thread id.'),
  handleValidation,
  getThread
);

export default router;
