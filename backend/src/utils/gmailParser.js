function decodeBase64Url(data) {
  if (!data) {
    return '';
  }

  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString(
    'utf8'
  );
}

export function getHeader(payload, name) {
  const headers = payload?.headers || [];
  const match = headers.find(
    (header) => header.name?.toLowerCase() === name.toLowerCase()
  );
  return match?.value || '';
}

function walkParts(part, collected) {
  if (!part) {
    return collected;
  }

  const mimeType = part.mimeType || '';

  if (mimeType === 'text/plain' && part.body?.data) {
    collected.text += decodeBase64Url(part.body.data);
  } else if (mimeType === 'text/html' && part.body?.data) {
    collected.html += decodeBase64Url(part.body.data);
  }

  if (part.filename && part.body?.attachmentId) {
    collected.attachments.push({
      filename: part.filename,
      mimeType,
      size: part.body.size || 0,
      attachmentId: part.body.attachmentId,
    });
  }

  for (const child of part.parts || []) {
    walkParts(child, collected);
  }

  return collected;
}

export function parseMessageBody(payload) {
  return walkParts(payload, { text: '', html: '', attachments: [] });
}

export function parseAddress(value) {
  const match = /^\s*(.*?)\s*<([^>]+)>\s*$/.exec(value || '');

  if (match) {
    return { name: match[1].replace(/^"|"$/g, ''), email: match[2] };
  }

  return { name: value || '', email: value || '' };
}

export function parseMessageSummary(message) {
  const labelIds = message.labelIds || [];
  const payload = message.payload || {};
  const from = getHeader(payload, 'From');

  return {
    id: message.id,
    threadId: message.threadId,
    from: parseAddress(from),
    to: getHeader(payload, 'To'),
    subject: getHeader(payload, 'Subject') || '(no subject)',
    snippet: message.snippet || '',
    date: getHeader(payload, 'Date'),
    internalDate: message.internalDate
      ? new Date(Number(message.internalDate)).toISOString()
      : null,
    isUnread: labelIds.includes('UNREAD'),
    isStarred: labelIds.includes('STARRED'),
    hasAttachments: (payload.parts || []).some((part) => Boolean(part.filename)),
    labelIds,
  };
}

export function parseMessageDetail(message) {
  const payload = message.payload || {};
  const body = parseMessageBody(payload);

  return {
    ...parseMessageSummary(message),
    cc: getHeader(payload, 'Cc'),
    bcc: getHeader(payload, 'Bcc'),
    messageIdHeader: getHeader(payload, 'Message-ID'),
    references: getHeader(payload, 'References'),
    bodyText: body.text,
    bodyHtml: body.html,
    attachments: body.attachments,
    hasAttachments: body.attachments.length > 0,
  };
}
