import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    // Optionally render a loading spinner or skeleton here
    return <div>Loading authentication status...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    // Redirect to home or a 403 page if authenticated but unauthorized
    // For this iteration, redirect to home.
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}