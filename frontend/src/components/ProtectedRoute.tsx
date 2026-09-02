import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps): React.JSX.Element {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(ROUTES.LOGIN, { replace: true, state: { from: location.pathname } });
      } else if (roles && user && !roles.includes(user.role)) {
        navigate(ROUTES.HOME, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, roles, navigate]);

  if (isLoading || !isAuthenticated || (roles && user && !roles.includes(user.role))) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}