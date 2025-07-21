import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useGuest } from '../../contexts/GuestContext';
import OAuthLogin from './OAuthLogin';
import { toast } from 'react-toastify';
import { Eye, EyeOff, LogIn, Mail, Lock, Code, ArrowLeft } from 'lucide-react';

const EnhancedLogin = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { isDark } = useTheme();
  const { resetGuestCredits } = useGuest();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.usernameOrEmail, formData.password);
    
    if (result.success) {
      // Reset guest credits when user logs in
      resetGuestCredits();
      toast.success('Login successful! Welcome back to CodePilot!');
      
      // Navigate to the specified redirect path
      if (result.redirect) {
        navigate(result.redirect);
      }
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const handleOAuthSuccess = async (userData) => {
    try {
      // In a real implementation, you would send this to your backend
      // For now, we'll simulate successful OAuth login
      const result = await login(userData.email, null, { 
        provider: userData.provider,
        oauthData: userData 
      });
      
      if (result.success) {
        resetGuestCredits();
        toast.success(`Welcome! You've successfully signed in with ${userData.provider}!`);
        
        // Navigate to the specified redirect path
        if (result.redirect) {
          navigate(result.redirect);
        }
      } else {
        toast.error('OAuth login failed. Please try again.');
      }
    } catch (error) {
      toast.error('OAuth login failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-md w-full space-y-8">
        {/* Back to Home */}
        <div className="flex items-center">
          <Link
            to="/"
            className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
              isDark 
                ? 'text-gray-300 hover:text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Code className="h-8 w-8 text-white" />
          </div>
          <h2 className={`mt-6 text-3xl font-extrabold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back to{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CodePilot
            </span>
          </h2>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Sign in to continue your coding journey
          </p>
        </div>

        {/* Login Form */}
        <div className={`bg-white dark:bg-gray-800 py-8 px-6 shadow-2xl rounded-2xl border ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="usernameOrEmail" className="sr-only">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    required
                    className={`appearance-none relative block w-full px-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      isDark
                        ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'
                    }`}
                    placeholder="Username or Email"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className={`appearance-none relative block w-full px-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-colors ${
                      isDark
                        ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className={`h-5 w-5 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                    ) : (
                      <Eye className={`h-5 w-5 ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 mr-2" />
                    Sign in
                  </>
                )}
              </button>
            </div>

            {/* OAuth Login */}
            <OAuthLogin onSuccess={handleOAuthSuccess} />

            <div className="text-center">
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Get 20 free credits when you create an account!
              </p>
            </div>
          </form>
        </div>

        {/* Features */}
        <div className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>✨ AI-Powered Code Reviews • 🔗 GitHub Integration • 🚀 Instant Feedback</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLogin;
