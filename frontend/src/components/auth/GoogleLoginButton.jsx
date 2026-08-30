import { useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';

import { authApi } from '../../services/api.js';

export default function GoogleLoginButton({ label = 'Continue with Google' }) {
  const [redirecting, setRedirecting] = useState(false);

  const startLogin = () => {
    setRedirecting(true);
    window.location.href = authApi.googleLoginUrl();
  };

  return (
    <button
      type="button"
      onClick={startLogin}
      disabled={redirecting}
      className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {redirecting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Connecting to Google...
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          {label}
        </>
      )}
    </button>
  );
}
