import { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Mail } from 'lucide-react';

import GoogleLoginButton from '../components/auth/GoogleLoginButton.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useAuthStore } from '../store/authStore.js';

const ERROR_MESSAGES = {
  access_denied:
    'You did not grant access to your Google account. Approve the permissions to continue.',
  invalid_state:
    'The sign-in request could not be verified. Please try signing in again.',
  missing_code: 'Google did not return an authorization code. Please try again.',
  google_auth_failed:
    'Google sign-in could not be completed. Please try again in a moment.',
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const status = useAuthStore((state) => state.status);
  const loadSession = useAuthStore((state) => state.loadSession);

  useEffect(() => {
    if (status === 'idle') {
      loadSession();
    }
  }, [status, loadSession]);

  if (status === 'authenticated') {
    return <Navigate to="/dashboard" replace />;
  }

  const errorCode = searchParams.get('error');

  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {errorCode ? (
          <div className="mb-4">
            <ErrorState
              title="Sign-in failed"
              message={
                ERROR_MESSAGES[errorCode] ||
                'Sign-in could not be completed. Please try again.'
              }
            />
          </div>
        ) : null}

        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
          <Mail className="mx-auto h-8 w-8 text-blue-600" />
          <h1 className="mt-4 text-xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">
            Use your Google account. Your Gmail password is never requested or
            stored by this application.
          </p>

          <div className="mt-6">
            <GoogleLoginButton />
          </div>

          <Link
            to="/"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
