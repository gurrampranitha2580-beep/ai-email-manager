import * as activityService from '../services/activityService.js';

export async function listActivity(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const data = await activityService.listActivity(req.user._id, { limit });
    res.json({ success: true, data: { activities: data } });
  } catch (error) {
    next(error);
  }
}
