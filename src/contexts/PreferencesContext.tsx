import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define preferences interface
interface Preferences {
  darkMode: boolean;
  language: 'en-US' | 'it-IT';
  captureSystemAudio: boolean;
}

interface PreferencesContextType {
  preferences: Preferences;
  toggleDarkMode: () => void;
  setLanguage: (language: 'en-US' | 'it-IT') => void;
  toggleCaptureSystemAudio: () => void;
}

// Create context with default values
const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

// Default preferences
const defaultPreferences: Preferences = {
  darkMode: false,
  language: 'en-US',
  captureSystemAudio: false,
};

interface PreferencesProviderProps {
  children: ReactNode;
}

export const PreferencesProvider: React.FC<PreferencesProviderProps> = ({ children }) => {
  // Initialize state from localStorage if available
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const savedPreferences = localStorage.getItem('auralytics-preferences');
    return savedPreferences 
      ? JSON.parse(savedPreferences) 
      : defaultPreferences;
  });

  // Update document class when dark mode changes
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('auralytics-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };

  // Set language
  const setLanguage = (language: 'en-US' | 'it-IT') => {
    setPreferences(prev => ({
      ...prev,
      language
    }));
  };

  // Toggle system audio capture
  const toggleCaptureSystemAudio = () => {
    setPreferences(prev => ({
      ...prev,
      captureSystemAudio: !prev.captureSystemAudio
    }));
  };

  return (
    <PreferencesContext.Provider value={{ 
      preferences, 
      toggleDarkMode, 
      setLanguage,
      toggleCaptureSystemAudio
    }}>
      {children}
    </PreferencesContext.Provider>
  );
};

// Custom hook for using the preferences context
export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
