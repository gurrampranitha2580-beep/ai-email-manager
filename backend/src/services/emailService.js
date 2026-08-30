import { ACTIVITY_ACTIONS } from '../models/Activity.js';
import { recordActivity } from './activityService.js';
import * as gmailService from './gmailService.js';

const SEARCH_FIELDS = ['from', 'to', 'subject'];

export function buildSearchQuery({ q = '', field = '' } = {}) {
  const term = q.trim();

  if (!term) {
    return '';
  }

  if (SEARCH_FIELDS.includes(field)) {
    return `${field}:${term}`;
  }

  return term;
}

export async function getInbox(userId, options) {
  return gmailService.listMessages(userId, options);
}

export async function searchEmails(userId, { q, field, maxResults, pageToken }) {
  return gmailService.listMessages(userId, {
    query: buildSearchQuery({ q, field }),
    maxResults,
    pageToken,
  });
}

export async function getEmail(userId, messageId) {
  const message = await gmailService.getMessage(userId, messageId);

  await recordActivity(userId, ACTIVITY_ACTIONS.EMAIL_VIEWED, {
    emailId: message.id,
    threadId: message.threadId,
    metadata: { subject: message.subject },
  });

  return message;
}

export async function getThread(userId, threadId) {
  return gmailService.getThread(userId, threadId);
}

export async function getUnreadCount(userId) {
  return gmailService.getUnreadCount(userId);
}
