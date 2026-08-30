import * as emailService from '../services/emailService.js';

export async function listInbox(req, res, next) {
  try {
    const data = await emailService.getInbox(req.user._id, {
      maxResults: Number(req.query.maxResults) || 25,
      pageToken: req.query.pageToken,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function searchEmails(req, res, next) {
  try {
    const data = await emailService.searchEmails(req.user._id, {
      q: req.query.q,
      field: req.query.field,
      maxResults: Number(req.query.maxResults) || 25,
      pageToken: req.query.pageToken,
    });
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getEmail(req, res, next) {
  try {
    const data = await emailService.getEmail(req.user._id, req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const data = await emailService.getUnreadCount(req.user._id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
