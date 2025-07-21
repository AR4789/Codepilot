import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const UserAvatar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/');
    setIsOpen(false);
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) {
    return null;
  }

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDark 
              ? 'text-gray-200 hover:bg-gray-700 border border-gray-600' 
              : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Avatar */}
          <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {getInitials(user.username || user.fullName)}
          </div>
          
          {/* User Info */}
          <div className="flex items-center space-x-2">
            <span className="hidden sm:block">
              {user.username || user.fullName || 'User'}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg ring-1 ring-opacity-5 focus:outline-none z-50 ${
            isDark 
              ? 'bg-gray-800 ring-gray-700' 
              : 'bg-white ring-black'
          }`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {/* User Info Header */}
            <div className={`px-4 py-3 border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {getInitials(user.username || user.fullName)}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {user.username || user.fullName || 'User'}
                  </p>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {user.email}
                  </p>
                  <p className={`text-xs ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    {user.credits} credits
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <button
              onClick={handleProfile}
              className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm transition-colors ${
                isDark 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => {
                navigate('/dashboard');
                setIsOpen(false);
              }}
              className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm transition-colors ${
                isDark 
                  ? 'text-gray-200 hover:bg-gray-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              <Settings className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <div className={`border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-3 w-full text-left px-4 py-2 text-sm transition-colors ${
                  isDark 
                    ? 'text-red-400 hover:bg-gray-700' 
                    : 'text-red-600 hover:bg-gray-100'
                }`}
                role="menuitem"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
