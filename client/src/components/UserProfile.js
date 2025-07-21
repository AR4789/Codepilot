import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Mail, Calendar, CreditCard, DollarSign } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import axios from 'axios';

const UserProfile = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(API_ENDPOINTS.ME, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          setUserData(response.data);
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Error</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{error}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>No user data available</h2>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          {/* Header */}
          <div className={`${isDark ? 'bg-gray-700' : 'bg-blue-600'} px-6 py-8`}>
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-blue-600">
                {getInitials(userData.fullName || userData.username)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {userData.fullName || userData.username}
                </h1>
                <p className="text-blue-100">{userData.email}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Account Overview */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Credits</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {userData.credits}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        ${userData.totalSpent || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Personal Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Username</p>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.username}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</p>
                    <p className={`${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Account Actions
              </h2>
              <div className="space-y-3">
                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  Purchase Credits
                </button>
                <button className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}>
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
