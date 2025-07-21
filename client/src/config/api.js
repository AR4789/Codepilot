// API Configuration
const config = {
  // Base API URL
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  
  // Client URL
  CLIENT_URL: process.env.REACT_APP_CLIENT_URL || 'http://localhost:3000',
  
  // OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  GITHUB_CLIENT_ID: process.env.REACT_APP_GITHUB_CLIENT_ID,
  
  // Feature Flags
  ENABLE_OAUTH: process.env.REACT_APP_ENABLE_OAUTH === 'true',
  ENABLE_GUEST_MODE: process.env.REACT_APP_ENABLE_GUEST_MODE === 'true',
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${config.API_BASE_URL}/api/auth/login`,
  REGISTER: `${config.API_BASE_URL}/api/auth/register`,
  ME: `${config.API_BASE_URL}/api/auth/me`,
  
  // OAuth
  OAUTH_GOOGLE: `${config.API_BASE_URL}/oauth2/authorization/google`,
  OAUTH_GITHUB: `${config.API_BASE_URL}/oauth2/authorization/github`,
  OAUTH_SUCCESS: `${config.API_BASE_URL}/api/oauth/success`,
  OAUTH_FAILURE: `${config.API_BASE_URL}/api/oauth/failure`,
  
  // Credits
  CREDITS: `${config.API_BASE_URL}/api/credits`,
  PURCHASE_CREDITS: `${config.API_BASE_URL}/api/credits/purchase`,
  
  // Reviews
  REVIEW: `${config.API_BASE_URL}/api/review`,
};

// OAuth URLs
export const OAUTH_URLS = {
  GOOGLE: config.ENABLE_OAUTH ? API_ENDPOINTS.OAUTH_GOOGLE : null,
  GITHUB: config.ENABLE_OAUTH ? API_ENDPOINTS.OAUTH_GITHUB : null,
};

// Validation functions
export const validateConfig = () => {
  const errors = [];
  
  if (!config.API_BASE_URL) {
    errors.push('REACT_APP_API_BASE_URL is not configured');
  }
  
  if (config.ENABLE_OAUTH) {
    if (!config.GOOGLE_CLIENT_ID) {
      errors.push('REACT_APP_GOOGLE_CLIENT_ID is required when OAuth is enabled');
    }
    if (!config.GITHUB_CLIENT_ID) {
      errors.push('REACT_APP_GITHUB_CLIENT_ID is required when OAuth is enabled');
    }
  }
  
  return errors;
};

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('API Configuration:', {
    API_BASE_URL: config.API_BASE_URL,
    CLIENT_URL: config.CLIENT_URL,
    ENABLE_OAUTH: config.ENABLE_OAUTH,
    ENABLE_GUEST_MODE: config.ENABLE_GUEST_MODE,
  });
  
  const configErrors = validateConfig();
  if (configErrors.length > 0) {
    console.warn('Configuration warnings:', configErrors);
  }
}

export default config;
