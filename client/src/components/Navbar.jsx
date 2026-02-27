import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, isProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside — must be BEFORE any early returns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setAvatarDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide navbar on auth pages (they have their own minimal header)
  const authPages = ['/login', '/signup'];
  if (authPages.includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setAvatarDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role-specific dashboard link
  const getDashboardLink = () => {
    if (isAdmin()) return { to: '/admin/dashboard', label: 'Admin Dashboard' };
    if (isProvider()) return { to: '/provider/dashboard', label: 'Dashboard' };
    return { to: '/dashboard', label: 'My Bookings' };
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo — left */}
          <Link to="/" className="text-xl font-bold text-purple-600 hover:text-purple-700 transition flex-shrink-0">
            ServiXphere Lite
          </Link>

          {/* Desktop Navigation Links — center */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition ${location.pathname === '/' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`text-sm font-medium transition ${location.pathname === '/services' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Services
            </Link>
            <Link
              to="/providers"
              className={`text-sm font-medium transition ${location.pathname === '/providers' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {user ? 'Browse Providers' : 'Providers'}
            </Link>
            {user ? (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition ${location.pathname === '/dashboard' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                My Bookings
              </Link>
            ) : (
              <Link
                to="/about"
                className={`text-sm font-medium transition ${location.pathname === '/about' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
              >
                About Us
              </Link>
            )}
          </div>

          {/* Desktop Right Side — auth */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Role-specific nav links */}
                {isProvider() && (
                  <>
                    <Link
                      to="/provider/dashboard"
                      className={`text-sm font-medium transition ${location.pathname === '/provider/dashboard' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/provider/settings"
                      className={`text-sm font-medium transition ${location.pathname === '/provider/settings' ? 'text-purple-600' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      Settings
                    </Link>
                  </>
                )}

                {/* Avatar with dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center ring-2 ring-transparent group-hover:ring-purple-200 transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${avatarDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  {avatarDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 shadow-lg py-1 z-50">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1.5 text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full capitalize">
                          {user.role}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <Link
                          to={getDashboardLink().to}
                          onClick={() => setAvatarDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                          </svg>
                          {getDashboardLink().label}
                        </Link>
                        {!isAdmin() && !isProvider() && (
                          <Link
                            to="/dashboard"
                            onClick={() => setAvatarDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                            </svg>
                            Wallet
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-100 py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                          </svg>
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
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
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
              >
                Services
              </Link>
              <Link
                to="/providers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
              >
                {user ? 'Browse Providers' : 'Providers'}
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  My Bookings
                </Link>
              ) : (
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  About Us
                </Link>
              )}

              {user ? (
                <>
                  {/* User info */}
                  <div className="border-t border-gray-100 mt-2 pt-3 px-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={getDashboardLink().to}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    {getDashboardLink().label}
                  </Link>

                  {!isAdmin() && !isProvider() && (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                      Wallet
                    </Link>
                  )}

                  {isProvider() && (
                    <Link
                      to="/provider/settings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 hover:bg-gray-50 hover:text-purple-600 px-3 py-2.5 rounded-lg text-sm font-medium transition"
                    >
                      Settings
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-600 hover:bg-red-50 hover:text-red-600 px-3 py-2.5 rounded-lg text-sm font-medium transition w-full"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2 px-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center text-gray-700 hover:text-purple-600 py-2.5 rounded-lg text-sm font-medium transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg text-sm font-medium text-center transition"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav >
  );
};

export default Navbar;
