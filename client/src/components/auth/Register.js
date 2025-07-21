import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useGuest } from '../../contexts/GuestContext';
import OAuthLogin from './OAuthLogin';
import { toast } from 'react-toastify';
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  UserPlus, 
  Code, 
  ArrowLeft,
  CheckCircle,
  Gift
} from 'lucide-react';

const EnhancedRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const { isDark } = useTheme();
  const { resetGuestCredits } = useGuest();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(formData.username, formData.email, formData.password, formData.username, resetGuestCredits);
    
    if (result.success) {
      if (result.message) {
        toast.success(result.message);
      } else {
        toast.success('Registration successful! Welcome to CodePilot! You have received 20 free credits!');
      }
      
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
      // For now, we'll simulate successful OAuth registration
      const result = await register(
        userData.username || userData.email.split('@')[0], 
        userData.email, 
        null, 
        userData.username || userData.email.split('@')[0],
        resetGuestCredits,
        { 
          provider: userData.provider,
          oauthData: userData 
        }
      );
      
      if (result.success) {
        toast.success(`Welcome! You've successfully signed up with ${userData.provider}! You have received 20 free credits!`);
        
        // Navigate to the specified redirect path
        if (result.redirect) {
          navigate(result.redirect);
        }
      } else {
        toast.error('OAuth registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('OAuth registration failed. Please try again.');
    }
  };

  const benefits = [
    { icon: Gift, text: '20 free credits to get started' },
    { icon: CheckCircle, text: 'AI-powered code reviews' },
    { icon: CheckCircle, text: 'GitHub repository analysis' },
    { icon: CheckCircle, text: 'Instant feedback and suggestions' },
    { icon: CheckCircle, text: 'Code improvement recommendations' },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="space-y-8">
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

            <div>
              <h1 className={`text-4xl lg:text-5xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Join{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CodePilot
                </span>
              </h1>
              <p className={`text-xl mb-8 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Transform your coding experience with AI-powered reviews and intelligent suggestions.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        benefit.icon === Gift 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className={`text-lg ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {benefit.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h2 className={`mt-6 text-3xl font-extrabold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Create your account
              </h2>
              <p className={`mt-2 text-sm ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Start your coding journey with 20 free credits
              </p>
            </div>

            {/* Registration Form */}
            <div className={`bg-white dark:bg-gray-800 py-8 px-6 shadow-2xl rounded-2xl border ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className={`appearance-none relative block w-full px-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isDark
                            ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                            : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'
                        }`}
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={`appearance-none relative block w-full px-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          isDark
                            ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                            : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'
                        }`}
                        placeholder="Email address"
                        value={formData.email}
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
                        placeholder="Password (min. 6 characters)"
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

                  <div>
                    <label htmlFor="confirmPassword" className="sr-only">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className={`h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        className={`appearance-none relative block w-full px-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-colors ${
                          isDark
                            ? 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                            : 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white'
                        }`}
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
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
                        <UserPlus className="h-5 w-5 mr-2" />
                        Create Account & Get 20 Credits
                      </>
                    )}
                  </button>
                </div>

                {/* OAuth Registration */}
                <OAuthLogin onSuccess={handleOAuthSuccess} />

                <div className="text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Terms */}
            <div className={`text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRegister;
