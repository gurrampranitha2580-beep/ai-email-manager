import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import EmailThread from '../components/email/EmailThread.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { emailsApi, threadsApi } from '../services/api.js';

export default function EmailDetails() {
  const { id } = useParams();

  const { status, data, error, retry } = useAsync(async () => {
    const message = await emailsApi.get(id);
    return threadsApi.get(message.threadId);
  }, [id]);

  return (
    <div className="space-y-4">
      <Link
        to="/inbox"
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to inbox
      </Link>

      {status === 'loading' ? (
        <LoadingState message="Loading conversation..." />
      ) : null}

      {status === 'error' ? (
        <ErrorState
          title="Could not load this email"
          message={error?.message}
          onRetry={retry}
        />
      ) : null}

      {status === 'success' ? <EmailThread thread={data} /> : null}
    </div>
  );
}
