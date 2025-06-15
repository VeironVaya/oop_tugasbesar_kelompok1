import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  // Directly check localStorage for the token
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; // Convert token (or null) to a boolean

  if (!isAuthenticated) {
    // If no token, redirect to the login page
    return <Navigate to={redirectPath} replace />;
  }

  // If token exists, render the nested routes/components
  return <Outlet />;
};

export default ProtectedRoute;