import { Link } from 'react-router-dom';
import { Inbox as InboxIcon, Mail, ShieldCheck } from 'lucide-react';

import EmailList from '../components/email/EmailList.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { emailsApi } from '../services/api.js';
import { useAuthStore } from '../store/authStore.js';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-blue-600" />
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="text-lg font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const gmail = useAuthStore((state) => state.gmail);

  const { status, data, error, retry } = useAsync(
    () =>
      Promise.all([
        emailsApi.unreadCount(),
        emailsApi.list({ maxResults: 5 }),
      ]).then(([counts, inbox]) => ({ counts, inbox })),
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-sm text-slate-600">{user?.email}</p>
      </div>

      {status === 'loading' ? <LoadingState message="Loading Gmail data..." /> : null}

      {status === 'error' ? (
        <ErrorState
          title="Could not load your Gmail data"
          message={error?.message}
          onRetry={retry}
        />
      ) : null}

      {status === 'success' ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={Mail}
              label="Unread"
              value={data.counts.unread}
            />
            <StatCard
              icon={InboxIcon}
              label="Inbox total"
              value={data.counts.total}
            />
            <StatCard
              icon={ShieldCheck}
              label="Gmail"
              value={gmail?.status || 'unknown'}
            />
          </div>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Recent emails</h2>
              <Link to="/inbox" className="text-sm text-blue-600 hover:underline">
                View inbox
              </Link>
            </div>

            {data.inbox.messages.length === 0 ? (
              <EmptyState
                icon={InboxIcon}
                title="Your inbox is empty"
                message="New messages will appear here."
              />
            ) : (
              <EmailList emails={data.inbox.messages} />
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
