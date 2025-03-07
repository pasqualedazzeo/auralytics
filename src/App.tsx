import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/darkMode.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PreferencesProvider } from './contexts/PreferencesContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TranscriptionPage from './pages/TranscriptionPage';
import TranscriptViewerPage from './pages/TranscriptViewerPage';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-neutral-900">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transcribe" 
            element={
              <ProtectedRoute>
                <TranscriptionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/transcripts" 
            element={
              <ProtectedRoute>
                <TranscriptViewerPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect to login by default */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <AppRoutes />
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
