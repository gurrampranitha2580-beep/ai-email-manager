import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

export default function Login() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-8 text-center">
        <Mail className="mx-auto h-8 w-8 text-blue-600" />
        <h1 className="mt-4 text-xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Google sign-in is added in the next milestone. Your Gmail password is
          never requested.
        </p>
        <button
          type="button"
          disabled
          className="mt-6 w-full cursor-not-allowed rounded-md bg-slate-200 px-4 py-2 font-medium text-slate-500"
        >
          Continue with Google
        </button>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-blue-600 hover:underline"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
