import { Router } from 'express';
import { query } from 'express-validator';

import { listActivity } from '../controllers/activityController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validation.js';

const router = Router();

router.get(
  '/activity',
  requireAuth,
  query('limit').optional().isInt({ min: 1, max: 100 }),
  handleValidation,
  listActivity
);

export default router;
