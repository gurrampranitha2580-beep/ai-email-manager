import { useState } from 'react';
import { Link2Off, ShieldCheck } from 'lucide-react';

import GoogleLoginButton from '../components/auth/GoogleLoginButton.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useAuthStore } from '../store/authStore.js';

const STATUS_LABELS = {
  connected: 'Connected',
  disconnected: 'Disconnected',
  expired: 'Expired — reconnect required',
};

export default function Settings() {
  const user = useAuthStore((state) => state.user);
  const gmail = useAuthStore((state) => state.gmail);
  const disconnectGmail = useAuthStore((state) => state.disconnectGmail);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const disconnect = async () => {
    setBusy(true);
    setError(null);

    try {
      await disconnectGmail();
    } catch (err) {
      setError(err.apiError || { message: 'Could not disconnect Gmail.' });
    } finally {
      setBusy(false);
    }
  };

  const connected = gmail?.status === 'connected';

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Account</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Name</dt>
            <dd className="text-slate-900">{user?.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Email</dt>
            <dd className="text-slate-900">{user?.email}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">Gmail connection</h2>

        <p className="mt-2 text-sm text-slate-600">
          Status:{' '}
          <span
            className={connected ? 'font-medium text-green-700' : 'font-medium text-amber-700'}
          >
            {STATUS_LABELS[gmail?.status] || 'Not connected'}
          </span>
        </p>

        {gmail?.googleAccountEmail ? (
          <p className="text-sm text-slate-600">
            Account: {gmail.googleAccountEmail}
          </p>
        ) : null}

        {error ? (
          <div className="mt-3">
            <ErrorState title="Disconnect failed" message={error.message} />
          </div>
        ) : null}

        <div className="mt-4 max-w-xs">
          {connected ? (
            <button
              type="button"
              onClick={disconnect}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              <Link2Off className="h-4 w-4" />
              {busy ? 'Disconnecting...' : 'Disconnect Gmail'}
            </button>
          ) : (
            <GoogleLoginButton label="Reconnect Google account" />
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-green-600" />
          <p className="text-sm text-slate-600">
            This application never asks for or stores your Gmail password. Access
            is granted through Google OAuth and stored encrypted on the server
            only.
          </p>
        </div>
      </section>
    </div>
  );
}
