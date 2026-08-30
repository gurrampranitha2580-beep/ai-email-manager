import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Mail, Menu } from 'lucide-react';

import { useUiStore } from '../../store/uiStore.js';
import { useAuthStore } from '../../store/authStore.js';

export default function Navbar() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-3 px-4">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Mail className="h-5 w-5 text-blue-600" />
          <span>AI Email Manager</span>
        </Link>

        {user ? (
          <div className="ml-auto flex items-center gap-3">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt=""
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full"
              />
            ) : null}
            <span className="hidden text-sm text-slate-700 sm:inline">
              {user.email}
            </span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
