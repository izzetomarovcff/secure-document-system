import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const { role } = JSON.parse(atob(token.split('.')[1]));
    if (allowedRoles.includes(role)) {
      return <Outlet />;
    } else {
      return <Navigate to="/unauthorized" />;
    }
  } catch (err) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
