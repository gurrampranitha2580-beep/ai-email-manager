import { CheckCircle2 } from 'lucide-react';

import { useHealthCheck } from '../../hooks/useHealthCheck.js';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';

export default function HealthStatus() {
  const { status, data, error, retry } = useHealthCheck();

  if (status === 'loading') {
    return <LoadingState message="Checking backend connection..." />;
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Backend unreachable"
        message={error?.message}
        onRetry={retry}
      />
    );
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center gap-2 font-medium text-emerald-900">
        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
        Backend connected
      </div>
      <dl className="mt-3 grid gap-1 text-sm text-emerald-900 sm:grid-cols-2">
        <div>
          <dt className="inline font-medium">Service: </dt>
          <dd className="inline">{data.service}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Environment: </dt>
          <dd className="inline">{data.environment}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Uptime: </dt>
          <dd className="inline">{data.uptimeSeconds}s</dd>
        </div>
        <div>
          <dt className="inline font-medium">Checked at: </dt>
          <dd className="inline">{new Date(data.timestamp).toLocaleTimeString()}</dd>
        </div>
      </dl>
    </div>
  );
}
