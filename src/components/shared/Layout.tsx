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
      
      {/* Background pattern - subtle grid */}
      {showBackground && (
        <div className="fixed inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-grid-neutral-700/[0.2] bg-[size:20px_20px]"></div>
        </div>
      )}
      
      <main className={`flex-grow pt-16 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`${fullWidth ? 'w-full' : 'max-w-7xl mx-auto'} py-8 sm:py-12 px-4 sm:px-6 lg:px-8`}>
          {/* Optional header section with title and description */}
          {(title || description) && (
            <div className={`${centerContent ? 'text-center mx-auto max-w-3xl' : ''} mb-8 sm:mb-12`}>
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
            </div>
          )}
          
          {/* Main content with subtle entrance animation */}
          <div className={`${centerContent ? 'flex flex-col items-center justify-center' : ''}`}>
            {children}
          </div>
        </div>
      </main>
      
      {/* Minimal footer */}
      <footer className="bg-white border-t border-neutral-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} Auralytics
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-400 hover:text-neutral-500 transition-colors">
                <span className="sr-only">Privacy</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-neutral-400 hover:text-neutral-500 transition-colors">
                <span className="sr-only">Help</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z" clipRule="evenodd" />
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
