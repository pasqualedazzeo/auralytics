import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  centerContent?: boolean;
  fullWidth?: boolean;
  showBackground?: boolean;
}

/**
 * Layout component that provides consistent page structure
 * Includes navigation bar and main content area with subtle animations
 */
const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  description,
  centerContent = false,
  fullWidth = false,
  showBackground = true
}) => {
  const [mounted, setMounted] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navigation />
      
      {/* Enhanced background with subtle patterns */}
      {showBackground && (
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-grid-neutral-700/[0.15] bg-[size:24px_24px]"></div>
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary-100/30 to-transparent"></div>
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-secondary-100/30 to-transparent"></div>
        </div>
      )}
      
      <main className={`flex-grow pt-16 ${mounted ? 'animate-fade-in' : 'opacity-0'} relative z-10`}>
        <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} py-8 sm:py-12 px-4 sm:px-6 lg:px-8`}>
          {/* Enhanced header section with animations */}
          {(title || description) && (
            <div className={`${centerContent ? 'text-center mx-auto max-w-3xl' : ''} mb-8 sm:mb-12 ${mounted ? 'animate-slide-down' : 'opacity-0'}`}>
              {title && (
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-secondary-700">
                    {title}
                  </span>
                </h1>
              )}
              {description && (
                <p className="mt-3 text-lg text-neutral-600 max-w-3xl">
                  {description}
                </p>
              )}
              <div className={`mt-4 h-1 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full ${centerContent ? 'mx-auto' : 'sm:mx-0'}`}></div>
            </div>
          )}
          
          {/* Main content with enhanced animations */}
          <div 
            className={`
              ${centerContent ? 'flex flex-col items-center justify-center' : ''} 
              ${mounted ? 'animate-slide-up' : 'opacity-0'}
              transition-all duration-400 ease-bounce-in-out
            `}
          >
            {children}
          </div>
        </div>
      </main>
      
      {/* Enhanced footer with better styling */}
      <footer className="bg-white border-t border-neutral-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center mr-2">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15V3M12 15C10.3431 15 9 16.3431 9 18C9 19.6569 10.3431 21 12 21C13.6569 21 15 19.6569 15 18C15 16.3431 13.6569 15 12 15Z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-neutral-600">
                {new Date().getFullYear()} Auralytics
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors duration-300">
                <span className="sr-only">Privacy</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors duration-300">
                <span className="sr-only">Help</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors duration-300">
                <span className="sr-only">Terms</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
