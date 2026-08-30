import { useState } from 'react';
import { Inbox as InboxIcon } from 'lucide-react';

import EmailList from '../components/email/EmailList.jsx';
import SearchBar from '../components/email/SearchBar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { emailsApi } from '../services/api.js';

export default function Inbox() {
  const [search, setSearch] = useState({ q: '', field: '' });

  const { status, data, error, retry } = useAsync(
    () =>
      search.q
        ? emailsApi.search({ q: search.q, field: search.field })
        : emailsApi.list(),
    [search.q, search.field]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">
          {search.q ? 'Search results' : 'Inbox'}
        </h1>
      </div>

      <SearchBar
        initialQuery={search.q}
        onSearch={setSearch}
        onClear={() => setSearch({ q: '', field: '' })}
      />

      {status === 'loading' ? <LoadingState message="Loading emails..." /> : null}

      {status === 'error' ? (
        <ErrorState
          title="Could not load emails"
          message={error?.message}
          onRetry={retry}
        />
      ) : null}

      {status === 'success' && data.messages.length === 0 ? (
        <EmptyState
          icon={InboxIcon}
          title={search.q ? 'No matching emails' : 'Your inbox is empty'}
          message={
            search.q
              ? 'Try a different search term or clear the search.'
              : 'New messages will appear here.'
          }
        />
      ) : null}

      {status === 'success' && data.messages.length > 0 ? (
        <EmailList emails={data.messages} />
      ) : null}
    </div>
  );
}
