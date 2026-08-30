import { google } from 'googleapis';

import { CONNECTION_STATUS, GmailConnection } from '../models/GmailConnection.js';
import { decrypt, encrypt } from '../utils/encryption.js';
import { AppError, ERROR_CODES } from '../middleware/errorHandler.js';
import { createOAuthClient } from './authService.js';
import { parseMessageDetail, parseMessageSummary } from '../utils/gmailParser.js';

async function loadConnection(userId) {
  const connection = await GmailConnection.findOne({ userId }).select(
    '+encryptedAccessToken +encryptedRefreshToken'
  );

  if (!connection || connection.status === CONNECTION_STATUS.DISCONNECTED) {
    throw new AppError(
      ERROR_CODES.GMAIL_NOT_CONNECTED,
      'Your Gmail account is not connected. Connect it from Settings to continue.',
      400
    );
  }

  return connection;
}

async function markConnectionExpired(connection) {
  connection.status = CONNECTION_STATUS.EXPIRED;
  await connection.save();
}

export async function getGmailClient(userId) {
  const connection = await loadConnection(userId);
  const oauthClient = createOAuthClient();

  oauthClient.setCredentials({
    access_token: decrypt(connection.encryptedAccessToken) || undefined,
    refresh_token: decrypt(connection.encryptedRefreshToken) || undefined,
    expiry_date: connection.tokenExpiry ? connection.tokenExpiry.getTime() : undefined,
  });

  oauthClient.on('tokens', async (tokens) => {
    try {
      const update = {};
      if (tokens.access_token) {
        update.encryptedAccessToken = encrypt(tokens.access_token);
      }
      if (tokens.refresh_token) {
        update.encryptedRefreshToken = encrypt(tokens.refresh_token);
      }
      if (tokens.expiry_date) {
        update.tokenExpiry = new Date(tokens.expiry_date);
      }
      if (Object.keys(update).length > 0) {
        update.status = CONNECTION_STATUS.CONNECTED;
        await GmailConnection.updateOne({ _id: connection._id }, update);
      }
    } catch (error) {
      console.error('Could not persist refreshed Google tokens:', error.message);
    }
  });

  return { gmail: google.gmail({ version: 'v1', auth: oauthClient }), connection };
}

async function callGmail(connection, operation) {
  try {
    return await operation();
  } catch (error) {
    const status = error?.response?.status ?? error?.code;
    const reason = error?.response?.data?.error;

    if (status === 401 || reason === 'invalid_grant') {
      await markConnectionExpired(connection);
      throw new AppError(
        ERROR_CODES.GOOGLE_TOKEN_EXPIRED,
        'Your Gmail connection has expired. Please reconnect your Google account.',
        401
      );
    }

    if (status === 404) {
      throw new AppError(
        ERROR_CODES.EMAIL_NOT_FOUND,
        'That message could not be found in Gmail.',
        404
      );
    }

    throw new AppError(
      ERROR_CODES.GMAIL_API_ERROR,
      'Gmail could not complete that request. Please try again.',
      502
    );
  }
}

export async function listMessages(userId, { query = '', maxResults = 25, pageToken } = {}) {
  const { gmail, connection } = await getGmailClient(userId);

  const list = await callGmail(connection, () =>
    gmail.users.messages.list({
      userId: 'me',
      q: query || undefined,
      labelIds: query ? undefined : ['INBOX'],
      maxResults,
      pageToken: pageToken || undefined,
    })
  );

  const messages = list.data.messages || [];

  const detailed = await Promise.all(
    messages.map((message) =>
      callGmail(connection, () =>
        gmail.users.messages.get({
          userId: 'me',
          id: message.id,
          format: 'metadata',
          metadataHeaders: ['From', 'To', 'Subject', 'Date'],
        })
      )
    )
  );

  return {
    messages: detailed.map((response) => parseMessageSummary(response.data)),
    nextPageToken: list.data.nextPageToken || null,
    resultSizeEstimate: list.data.resultSizeEstimate || 0,
  };
}

export async function getMessage(userId, messageId) {
  const { gmail, connection } = await getGmailClient(userId);

  const response = await callGmail(connection, () =>
    gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' })
  );

  return parseMessageDetail(response.data);
}

export async function getThread(userId, threadId) {
  const { gmail, connection } = await getGmailClient(userId);

  const response = await callGmail(connection, () =>
    gmail.users.threads.get({ userId: 'me', id: threadId, format: 'full' })
  );

  const messages = (response.data.messages || []).map(parseMessageDetail);

  return {
    id: response.data.id,
    historyId: response.data.historyId,
    subject: messages[0]?.subject || '(no subject)',
    messageCount: messages.length,
    messages,
  };
}

export async function getUnreadCount(userId) {
  const { gmail, connection } = await getGmailClient(userId);

  const response = await callGmail(connection, () =>
    gmail.users.labels.get({ userId: 'me', id: 'INBOX' })
  );

  return {
    unread: response.data.messagesUnread || 0,
    total: response.data.messagesTotal || 0,
  };
}
