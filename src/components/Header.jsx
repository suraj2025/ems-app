import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Employee Management System
        </Link>

        {/* Hamburger Icon (mobile only) */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className={`flex-col md:flex md:flex-row md:items-center md:gap-6 ${open ? 'flex' : 'hidden'} md:flex`}>
          <Link to="/login" className="mt-2 md:mt-0 text-gray-600 hover:text-blue-600 transition">
            Login
          </Link>
          <Link to="/register" className="mt-2 md:mt-0 text-gray-600 hover:text-blue-600 transition">
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
