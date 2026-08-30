import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '../../store/authStore.js';
import LoadingState from '../common/LoadingState.jsx';

export default function ProtectedRoute() {
  const status = useAuthStore((state) => state.status);
  const loadSession = useAuthStore((state) => state.loadSession);
  const location = useLocation();

  useEffect(() => {
    if (status === 'idle') {
      loadSession();
    }
  }, [status, loadSession]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="p-6">
        <LoadingState message="Checking your session..." />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
