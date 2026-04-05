import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, userRole, ...rest }) => {
  // If user is not an admin, redirect to login page
  if (userRole !== 'ADMIN') {
    return <Navigate to="/login" />;
  }

  // If user is an admin, render the component
  return element;
};

export default PrivateRoute;
