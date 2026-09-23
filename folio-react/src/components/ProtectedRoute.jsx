import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const toast = useToast();
  const warned = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !warned.current) {
      warned.current = true;
      toast.error('Sign in to continue');
    }
  }, [isAuthenticated, toast]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
