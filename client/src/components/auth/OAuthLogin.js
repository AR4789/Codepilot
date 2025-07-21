import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Github, Chrome } from 'lucide-react';
import { toast } from 'react-toastify';
import { OAUTH_URLS } from '../../config/api';
import config from '../../config/api';

const OAuthLogin = ({ onSuccess }) => {
  const { isDark } = useTheme();

  const handleGoogleLogin = async () => {
    try {
      if (!config.ENABLE_OAUTH || !OAUTH_URLS.GOOGLE) {
        toast.error('Google OAuth is not configured');
        return;
      }
      
      toast.info('Redirecting to Google...');
      // Redirect to backend OAuth endpoint
      window.location.href = OAUTH_URLS.GOOGLE;
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  const handleGitHubLogin = async () => {
    try {
      if (!config.ENABLE_OAUTH || !OAUTH_URLS.GITHUB) {
        toast.error('GitHub OAuth is not configured');
        return;
      }
      
      toast.info('Redirecting to GitHub...');
      // Redirect to backend OAuth endpoint
      window.location.href = OAUTH_URLS.GITHUB;
    } catch (error) {
      console.error('GitHub login error:', error);
      toast.error('GitHub login failed. Please try again.');
    }
  };

  // Don't render OAuth buttons if OAuth is disabled
  if (!config.ENABLE_OAUTH) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className={`w-full border-t ${isDark ? 'border-gray-600' : 'border-gray-300'}`} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {OAUTH_URLS.GOOGLE && (
          <button
            onClick={handleGoogleLogin}
            className={`flex items-center justify-center px-4 py-3 border rounded-lg font-medium transition-all duration-300 hover:shadow-md ${
              isDark
                ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Chrome className="h-5 w-5 mr-2 text-blue-500" />
            <span>Google</span>
          </button>
        )}

        {OAUTH_URLS.GITHUB && (
          <button
            onClick={handleGitHubLogin}
            className={`flex items-center justify-center px-4 py-3 border rounded-lg font-medium transition-all duration-300 hover:shadow-md ${
              isDark
                ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Github className="h-5 w-5 mr-2" />
            <span>GitHub</span>
          </button>
        )}
      </div>

      <div className={`text-xs text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        <p>
          By signing in with OAuth, you agree to our{' '}
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
  );
};

export default OAuthLogin;
