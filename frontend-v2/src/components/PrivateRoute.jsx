import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/Api';
import Navbar from './Navbar';

const PrivateRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default PrivateRoute;
