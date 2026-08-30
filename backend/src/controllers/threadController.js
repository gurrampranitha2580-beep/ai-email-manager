import * as emailService from '../services/emailService.js';

export async function getThread(req, res, next) {
  try {
    const data = await emailService.getThread(req.user._id, req.params.threadId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
