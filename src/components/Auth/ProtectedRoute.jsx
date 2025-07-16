import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import LoadingScreen from '../UI/LoadingScreen';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { state } = useApp();
  const location = useLocation();
  const { user, userRole, loading } = state;

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/giriş" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = userRole === 'admin' ? '/admin' :
                        userRole === 'driver' ? '/şoför' :
                        userRole === 'customer' ? '/müşteri' : '/';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
