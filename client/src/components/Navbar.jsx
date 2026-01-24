import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-purple-600">
            ServiXphere Lite
          </Link>

          {/* Desktop Navigation Links - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Services
            </Link>
            <Link
              to="/providers"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              Providers
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-purple-600 transition font-medium"
            >
              About Us
            </Link>
          </div>

          {/* Desktop Right Side - Auth Buttons or User Info */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin() ? (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-purple-600 transition font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-purple-600 transition font-medium"
                  >
                    My Bookings
                  </Link>
                )}
                <span className="text-gray-700 font-medium">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-purple-600 hover:bg-white hover:text-purple-600 border border-purple-600 text-white px-4 py-2 rounded transition font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-purple-600 hover:bg-white hover:text-purple-600 border border-purple-600 text-white px-4 py-2 rounded transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 hover:bg-white hover:text-purple-600 border border-purple-600 text-white px-4 py-2 rounded transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-700 hover:text-purple-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Home
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Services
              </Link>
              <Link
                to="/providers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                Providers
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:text-purple-600 transition font-medium"
              >
                About Us
              </Link>

              {user ? (
                <>
                  {isAdmin() ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-purple-600 transition font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-purple-600 transition font-medium"
                    >
                      My Bookings
                    </Link>
                  )}
                  <span className="text-gray-700 font-medium py-2">
                    Hello, {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-purple-600 hover:bg-white hover:text-purple-600 border border-purple-600 text-white px-4 py-2 rounded transition font-medium text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-purple-600 hover:bg-white hover:text-purple-600 border border-purple-600 text-white px-4 py-2 rounded transition font-medium text-center"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-purple-600 hover:bg-white hover:text-purple-600 border border-purple-600 text-white px-4 py-2 rounded transition font-medium text-center"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
