import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  loginWithGoogle: async () => {},
  register: async () => {},
  logout: () => {},
  loading: false,
  error: null,
});

// Create a provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      if (email && password) {
        setIsAuthenticated(true);
        setUser({
          id: '1',
          name: 'Demo User',
          email: email,
          avatar: 'https://via.placeholder.com/150',
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Mock Google login function
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful Google login
      setIsAuthenticated(true);
      setUser({
        id: '2',
        name: 'Google User',
        email: 'google.user@example.com',
        avatar: 'https://via.placeholder.com/150',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred with Google login');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      if (email && password && name) {
        setIsAuthenticated(true);
        setUser({
          id: '3',
          name: name,
          email: email,
          avatar: 'https://via.placeholder.com/150',
        });
      } else {
        throw new Error('Invalid registration data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Mock logout function
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    loginWithGoogle,
    register,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
