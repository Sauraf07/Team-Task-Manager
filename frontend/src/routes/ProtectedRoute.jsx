import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ allowedRoles }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = !!user;
  const userRole = user ? user.user.role : null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />; // Redirect to dashboard if unauthorized
  }

  return <Outlet />; // Renders the child routes
};

export default ProtectedRoute;
