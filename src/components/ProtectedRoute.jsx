import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function isTokenValid(token) {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // in seconds
    return decoded.exp && decoded.exp > currentTime;
  } catch (e) {
    return false;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const isValid = token && isTokenValid(token);

  return isValid ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
