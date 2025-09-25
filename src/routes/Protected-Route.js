import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromCookies } from '../utils/Cookie-utils';
import NotFoundPage from '../Pages/Authentication/NotFoundPage';


const ProtectedRoute = ({ element, allowedRoles }) => {
  const user = getUserFromCookies();
  if (user && user.data) {
    const { role } = user.data; 
    if (allowedRoles.includes(role)) {
      return element;
    } else {
      return <NotFoundPage />;
    }
  }
  return <NotFoundPage />;
};

export default ProtectedRoute;
