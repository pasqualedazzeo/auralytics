import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  // Handle scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => logout();

  // Navigation links configuration
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/transcribe', label: 'Transcribe' },
    { path: '/transcripts', label: 'Transcripts' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full">
                  <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3M12 15C10.3431 15 9 16.3431 9 18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18C15 16.3431 13.6569 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="ml-3 text-lg font-medium bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Transcribe
              </span>
            </Link>
            
            {/* Desktop navigation links */}
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-600'
                      : 'text-neutral-500 hover:text-neutral-800'
                  } relative inline-flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop user menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-neutral-100">
                    {user.avatar ? (
                      <img className="h-8 w-8 rounded-full ring-2 ring-white" src={user.avatar} alt="" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center ring-2 ring-white">
                        <span className="text-white font-medium text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-neutral-700">
                      {user.name || user.email}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative inline-flex items-center px-4 py-1.5 overflow-hidden rounded-full group bg-white hover:bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 shadow-sm border border-neutral-100"
                >
                  <span className="relative text-sm font-medium text-neutral-700 group-hover:text-white transition-colors duration-300">
                    Sign out
                  </span>
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} sm:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-sm`}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                isActive(link.path)
                  ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 border-l-primary-500'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800 border-l-transparent'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* Mobile user menu */}
        {user && (
          <div className="pt-4 pb-3 border-t border-neutral-200 px-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user.avatar ? (
                  <img className="h-10 w-10 rounded-full" src={user.avatar} alt="" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-800">{user.name || user.email}</div>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50 rounded-md transition-colors duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
