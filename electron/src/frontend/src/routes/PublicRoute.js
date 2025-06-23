import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token');
  if (token) {
    const { role} = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    if(role == "superadmin"){
      return <Navigate to="/superadmin" />;
    }else if (role == "admin"){
      return <Navigate to="/admin" />;
    }else if(role == "subadmin"){
      return <Navigate to="/subadmin" />;
    }else if(role == "user"){
      return <Navigate to="/user" />;
    }
    
  }
  return <Outlet />;
};

export default PublicRoute;
