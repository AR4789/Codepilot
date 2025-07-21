import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { GuestProvider } from './contexts/GuestContext';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import OAuthCallback from './components/auth/OAuthCallback';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GuestProvider>
          <Router>
          <div className="App">
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* OAuth Callback */}
              <Route path="/oauth/callback" element={<OAuthCallback />} />
              
              {/* Dashboard - accessible to both authenticated and guest users */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Profile Page */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast Notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
          </Router>
        </GuestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
