import { Link } from 'react-router-dom';
import { Mail, Menu } from 'lucide-react';

import { useUiStore } from '../../store/uiStore.js';

export default function Navbar() {
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

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
      </div>
    </header>
  );
}
