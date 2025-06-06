import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AuthHeader = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Employee Management System
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className={`flex-col md:flex md:flex-row md:items-center md:gap-6 ${open ? 'flex' : 'hidden'} md:flex`}>
          <Link to="/" className="mt-2 md:mt-0 text-gray-600 hover:text-blue-600 transition">
            Dashboard
          </Link>
          <Link to="/employees" className="mt-2 md:mt-0 text-gray-600 hover:text-blue-600 transition">
            Employees
          </Link>
          <Link to="/attendance" className="mt-2 md:mt-0 text-gray-600 hover:text-blue-600 transition">
            Attendance
          </Link>
          <Link to="/leave" className="mt-2 md:mt-0 text-gray-600 hover:text-blue-600 transition">
            Leave Request
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 md:mt-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AuthHeader;
