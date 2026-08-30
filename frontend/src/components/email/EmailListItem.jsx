import { Link } from 'react-router-dom';
import { Paperclip, Star } from 'lucide-react';

import { formatDate } from '../../utils/format.js';

export default function EmailListItem({ email }) {
  return (
    <li>
      <Link
        to={`/email/${email.id}`}
        className={`flex items-start gap-3 border-b border-slate-200 px-4 py-3 hover:bg-slate-50 ${
          email.isUnread ? 'bg-white' : 'bg-slate-50/60'
        }`}
      >
        <Star
          className={`mt-0.5 h-4 w-4 shrink-0 ${
            email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
          }`}
          aria-label={email.isStarred ? 'Starred' : 'Not starred'}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span
              className={`truncate text-sm ${
                email.isUnread
                  ? 'font-semibold text-slate-900'
                  : 'text-slate-700'
              }`}
            >
              {email.from?.name || email.from?.email}
            </span>
            <span className="shrink-0 text-xs text-slate-500">
              {formatDate(email.internalDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <p
              className={`truncate text-sm ${
                email.isUnread ? 'font-medium text-slate-900' : 'text-slate-700'
              }`}
            >
              {email.subject}
            </p>
            {email.hasAttachments ? (
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            ) : null}
          </div>

          <p className="truncate text-xs text-slate-500">{email.snippet}</p>
        </div>
      </Link>
    </li>
  );
}
