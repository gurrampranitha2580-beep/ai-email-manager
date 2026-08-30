import { Route, Routes } from 'react-router-dom';

import AppShell from './components/layout/AppShell.jsx';
import Activity from './pages/Activity.jsx';
import Compose from './pages/Compose.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EmailDetails from './pages/EmailDetails.jsx';
import Inbox from './pages/Inbox.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import Settings from './pages/Settings.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/email/:id" element={<EmailDetails />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
