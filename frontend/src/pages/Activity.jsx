import { Activity as ActivityIcon } from 'lucide-react';

import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { activityApi } from '../services/api.js';
import { formatDateTime } from '../utils/format.js';

const ACTION_LABELS = {
  EMAIL_VIEWED: 'Opened an email',
  EMAIL_STARRED: 'Starred an email',
  EMAIL_UNSTARRED: 'Removed a star',
  EMAIL_ARCHIVED: 'Archived an email',
  EMAIL_TRASHED: 'Moved an email to trash',
  EMAIL_MARKED_READ: 'Marked an email as read',
  EMAIL_MARKED_UNREAD: 'Marked an email as unread',
  EMAIL_SENT: 'Sent an email',
  EMAIL_REPLIED: 'Replied to an email',
  AI_SUMMARY_GENERATED: 'Generated an AI summary',
  AI_REPLY_GENERATED: 'Generated an AI reply draft',
};

export default function Activity() {
  const { status, data, error, retry } = useAsync(() => activityApi.list(), []);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">Activity</h1>

      {status === 'loading' ? <LoadingState message="Loading activity..." /> : null}

      {status === 'error' ? (
        <ErrorState
          title="Could not load activity"
          message={error?.message}
          onRetry={retry}
        />
      ) : null}

      {status === 'success' && data.activities.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          message="Opening, starring, or sending email will be listed here."
        />
      ) : null}

      {status === 'success' && data.activities.length > 0 ? (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
          {data.activities.map((activity) => (
            <li key={activity.id} className="flex justify-between gap-4 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {ACTION_LABELS[activity.action] || activity.action}
                </p>
                {activity.metadata?.subject ? (
                  <p className="text-xs text-slate-500">
                    {activity.metadata.subject}
                  </p>
                ) : null}
              </div>
              <span className="shrink-0 text-xs text-slate-500">
                {formatDateTime(activity.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
