import DOMPurify from 'dompurify';

export function sanitizeEmailHtml(html) {
  return DOMPurify.sanitize(html || '', {
    FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'object', 'embed'],
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
    ALLOW_DATA_ATTR: false,
  });
}
