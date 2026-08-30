import { NavLink } from 'react-router-dom';
import {
  Activity,
  Inbox,
  LayoutDashboard,
  PenSquare,
  Settings,
} from 'lucide-react';

import { useUiStore } from '../../store/uiStore.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/compose', label: 'Compose', icon: PenSquare },
  { to: '/activity', label: 'Activity', icon: Activity },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const sidebarOpen = useUiStore((state) => state.sidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);

  return (
    <aside
      className={`${
        sidebarOpen ? 'block' : 'hidden'
      } w-full shrink-0 border-b border-slate-200 bg-white p-3 md:block md:w-56 md:border-b-0 md:border-r`}
    >
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
