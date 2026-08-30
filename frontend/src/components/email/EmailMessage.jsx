import { useState } from 'react';
import { ChevronDown, ChevronUp, Paperclip } from 'lucide-react';

import { formatDateTime } from '../../utils/format.js';
import { sanitizeEmailHtml } from '../../utils/sanitize.js';

export default function EmailMessage({ message, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <article className="border-b border-slate-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-slate-50"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-medium text-slate-900">
              {message.from?.name || message.from?.email}
            </span>
            <span className="text-xs text-slate-500">{message.from?.email}</span>
          </div>
          <p className="text-xs text-slate-500">To: {message.to || '—'}</p>
          {!expanded ? (
            <p className="mt-1 truncate text-sm text-slate-600">
              {message.snippet}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
          {formatDateTime(message.internalDate)}
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </button>

      {expanded ? (
        <div className="px-4 pb-4">
          {message.bodyHtml ? (
            <div
              className="prose prose-sm max-w-none break-words text-slate-800"
              // Sanitized on the client before insertion; backend never renders HTML.
              dangerouslySetInnerHTML={{
                __html: sanitizeEmailHtml(message.bodyHtml),
              }}
            />
          ) : (
            <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-800">
              {message.bodyText || message.snippet}
            </pre>
          )}

          {message.attachments?.length ? (
            <ul className="mt-4 space-y-1">
              {message.attachments.map((attachment) => (
                <li
                  key={attachment.attachmentId}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <Paperclip className="h-4 w-4 text-slate-400" />
                  {attachment.filename}
                  <span className="text-xs text-slate-400">
                    ({Math.round((attachment.size || 0) / 1024)} KB)
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
