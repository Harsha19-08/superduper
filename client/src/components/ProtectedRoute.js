import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, userType }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has the correct type
  if (user.userType !== userType) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
