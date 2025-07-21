import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../config/constants';

// Component to protect routes that require authentication
export const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/giriş' }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    // Redirect based on user role
    switch (userProfile?.role) {
      case USER_ROLES.ADMIN:
        return <Navigate to="/admin" replace />;
      case USER_ROLES.DRIVER:
        return <Navigate to="/driver" replace />;
      case USER_ROLES.CUSTOMER:
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/giriş" replace />;
    }
  }

  return children;
};

// Component to protect routes from authenticated users (like login page)
export const PublicRoute = ({ children, redirectTo = null }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (user && redirectTo) {
    // Redirect authenticated users based on their role
    if (!redirectTo || redirectTo === 'auto') {
      switch (userProfile?.role) {
        case USER_ROLES.ADMIN:
          return <Navigate to="/admin" replace />;
        case USER_ROLES.DRIVER:
          return <Navigate to="/driver" replace />;
        case USER_ROLES.CUSTOMER:
          return <Navigate to="/" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Admin only route
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole={USER_ROLES.ADMIN}>
      {children}
    </ProtectedRoute>
  );
};

// Driver only route
export const DriverRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole={USER_ROLES.DRIVER}>
      {children}
    </ProtectedRoute>
  );
};

// Customer only route
export const CustomerRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
      {children}
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
