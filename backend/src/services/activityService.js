import { Activity } from '../models/Activity.js';

export async function recordActivity(userId, action, details = {}) {
  try {
    await Activity.create({
      userId,
      action,
      emailId: details.emailId || null,
      threadId: details.threadId || null,
      metadata: details.metadata || {},
    });
  } catch (error) {
    // Activity logging must never break the user-facing operation.
    console.error('Could not record activity:', error.message);
  }
}

export async function listActivity(userId, { limit = 50 } = {}) {
  const activities = await Activity.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);

  return activities.map((activity) => activity.toPublicJSON());
}
