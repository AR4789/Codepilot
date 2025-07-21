import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios interceptor for authentication
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
const response = await axios.get(API_ENDPOINTS.ME, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
          setUser(response.data);
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (usernameOrEmail, password, oauthData = null) => {
    try {
      // Handle OAuth login
      if (oauthData) {
        setToken(oauthData.token);
        setUser(oauthData);
        localStorage.setItem('token', oauthData.token);
        return { success: true, redirect: '/dashboard' };
      }

      // Handle regular login
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        usernameOrEmail,
        password,
      });

      const { token: newToken, user: userData } = response.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      
      return { success: true, redirect: '/dashboard' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password, fullName, resetGuestCredits, oauthData = null) => {
    try {
      // Handle OAuth registration
      if (oauthData) {
        setToken(oauthData.token);
        setUser(oauthData);
        localStorage.setItem('token', oauthData.token);
        
        // Reset guest credits after successful registration
        if (resetGuestCredits) {
          resetGuestCredits();
        }
        
        return { success: true, redirect: '/dashboard' };
      }

      // Handle regular registration - redirect to login page
      const response = await axios.post(API_ENDPOINTS.REGISTER, {
        username,
        email,
        password,
        fullName,
      });

      // For regular registration, don't auto-login, redirect to login page
      return { success: true, redirect: '/login', message: 'Registration successful! Please sign in to continue.' };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserCredits = (newCredits) => {
    if (user) {
      setUser({ ...user, credits: newCredits });
    }
  };

  // OAuth-specific login method
  const oauthLogin = (userData) => {
    setToken(userData.token);
    setUser(userData);
    localStorage.setItem('token', userData.token);
  };

  const value = {
    user,
    setUser,
    token,
    setToken,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateUserCredits,
    oauthLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
