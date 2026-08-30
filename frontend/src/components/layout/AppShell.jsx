import { Outlet } from 'react-router-dom';

import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';

export default function AppShell() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
