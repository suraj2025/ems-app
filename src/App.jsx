import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employee';
import Attendance from './pages/Attendence';
import Leave from './pages/Leaverequest';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import AuthHeader from './components/AuthHeader';

function Layout({ children }) {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  // Show Header only on public pages
  const isPublicPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {isAuthenticated ? <AuthHeader /> : (isPublicPage && <Header />)}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
          <Route path="/leave" element={<ProtectedRoute><Leave /></ProtectedRoute>} />

          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
