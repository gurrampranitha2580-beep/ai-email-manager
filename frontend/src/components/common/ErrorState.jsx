import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-900">{title}</h3>
          {message ? <p className="mt-1 text-sm text-red-800">{message}</p> : null}
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
