import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowedRoles,
  redirectTo = '/login' 
}) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!currentUser || !userProfile) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access
  if (requiredRole && userProfile.role !== requiredRole) {
    return <Navigate to={getRoleDashboard(userProfile.role)} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userProfile.role)) {
    return <Navigate to={getRoleDashboard(userProfile.role)} replace />;
  }

  return <>{children}</>;
};

const getRoleDashboard = (role: UserRole): string => {
  switch (role) {
    case 'HOD':
      return '/dashboard/hod';
    case 'Chef':
      return '/dashboard/chef';
    case 'Manager':
      return '/dashboard/manager';
    case 'Storekeeper':
      return '/dashboard/store';
    default:
      return '/login';
  }
};