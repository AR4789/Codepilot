import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser, setToken, oauthLogin } = useAuth();
  const { isDark } = useTheme();
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const username = urlParams.get('user');
        const credits = urlParams.get('credits');
        const provider = urlParams.get('provider');
        const error = urlParams.get('error');

        console.log('OAuth callback params:', { token: !!token, username, credits, provider, error });

        if (error) {
          let errorMsg = 'OAuth authentication failed. Please try again.';
          
          switch (error) {
            case 'oauth_user_null':
              errorMsg = 'Authentication failed: User information not received.';
              break;
            case 'oauth_email_missing':
              errorMsg = 'Authentication failed: Email not provided by OAuth provider.';
              break;
            case 'oauth_server_error':
              errorMsg = 'Server error during authentication. Please try again.';
              break;
            case 'oauth_failed':
              errorMsg = 'OAuth provider authentication failed.';
              break;
            default:
              errorMsg = `Authentication failed: ${error}`;
          }
          
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
          setIsProcessing(false);
          
          // Redirect to login after showing error
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (token && username) {
          // Store the token
          localStorage.setItem('token', token);
          
          // Fetch complete user data from backend
          try {
            const response = await axios.get('http://localhost:5000/api/auth/me', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            const userData = response.data;
            console.log('Complete user data from backend:', userData);

            // Update auth context with complete user data
            if (oauthLogin) {
              oauthLogin({ ...userData, token });
            } else {
              setToken(token);
              setUser(userData);
            }
            
            const providerText = provider ? ` via ${provider.charAt(0).toUpperCase() + provider.slice(1)}` : '';
            toast.success(`Welcome ${userData.username || userData.fullName}${providerText}! You have ${userData.credits} credits.`);
            
            setIsProcessing(false);
            navigate('/dashboard');
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            setErrorMessage('Failed to load user profile. Please try again.');
            toast.error('Failed to load user profile');
            setIsProcessing(false);
            setTimeout(() => navigate('/login'), 3000);
          }
        } else {
          setErrorMessage('Invalid OAuth response: Missing token or user information.');
          toast.error('Invalid OAuth response. Please try again.');
          setIsProcessing(false);
          
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setErrorMessage('An unexpected error occurred during authentication.');
        toast.error('Authentication failed. Please try again.');
        setIsProcessing(false);
        
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleOAuthCallback();
  }, [location, navigate, setUser, setToken]);

  if (!isProcessing && errorMessage) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Authentication Failed
          </h2>
          <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {errorMessage}
          </p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Completing Authentication...
        </h2>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Please wait while we sign you in.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
