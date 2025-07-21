# Deployment Guide for CodePilot OAuth Configuration

This guide explains how to configure the OAuth authentication system for different environments (development, staging, production).

## Overview

The OAuth system has been refactored to use environment variables for easy deployment configuration. Both Google and GitHub OAuth are supported.

## Server Configuration

### Environment Variables

Create the following environment variables for your deployment:

#### Required Variables
```bash
# Application URLs
APP_SERVER_URL=https://your-api-domain.com
APP_CLIENT_URL=https://your-client-domain.com

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://your-client-domain.com
```

#### Optional Variables (with defaults)
```bash
# Server Configuration
SERVER_HOST=localhost
SERVER_PORT=5000

# Database Configuration
MONGODB_HOST=localhost
MONGODB_PORT=27017
MONGODB_DATABASE=codepilot

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRATION_MS=86400000

# Payment Configuration
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

### OAuth Provider Setup

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Set authorized redirect URIs:
   - Development: `http://localhost:5000/login/oauth2/code/google`
   - Production: `https://your-api-domain.com/login/oauth2/code/google`

#### GitHub OAuth Setup
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - Development: `http://localhost:5000/login/oauth2/code/github`
   - Production: `https://your-api-domain.com/login/oauth2/code/github`

## Client Configuration

### Environment Files

#### Development (.env.local)
```bash
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_CLIENT_URL=http://localhost:3000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
REACT_APP_ENABLE_OAUTH=true
REACT_APP_ENABLE_GUEST_MODE=true
```

#### Production (.env.production)
```bash
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_CLIENT_URL=https://your-client-domain.com
REACT_APP_GOOGLE_CLIENT_ID=your-production-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-production-github-client-id
REACT_APP_ENABLE_OAUTH=true
REACT_APP_ENABLE_GUEST_MODE=true
```

## Deployment Steps

### 1. Server Deployment
1. Set all required environment variables in your hosting platform
2. Ensure MongoDB is accessible
3. Deploy the Spring Boot application
4. Verify OAuth endpoints are accessible:
   - `GET /oauth2/authorization/google`
   - `GET /oauth2/authorization/github`
   - `GET /api/oauth/success`
   - `GET /api/oauth/failure`

### 2. Client Deployment
1. Create appropriate `.env.production` file
2. Build the React application: `npm run build`
3. Deploy to your hosting platform
4. Ensure the client can reach the API endpoints

### 3. OAuth Configuration Verification
1. Update OAuth provider redirect URIs with production URLs
2. Test OAuth flow in production environment
3. Monitor server logs for OAuth-related errors

## Troubleshooting

### Common Issues

#### 401 Unauthorized Errors
- Check if OAuth client IDs and secrets are correctly set
- Verify redirect URIs match exactly in OAuth provider settings
- Ensure CORS is properly configured for your client domain

#### OAuth Callback Failures
- Check server logs for detailed error messages
- Verify JWT secret is set and consistent
- Ensure database connectivity

#### CORS Issues
- Update `CORS_ALLOWED_ORIGINS` to include your client domain
- For multiple domains, separate with commas: `domain1.com,domain2.com`

### Debug Mode
Enable debug logging by setting:
```bash
LOGGING_LEVEL_COM_EXAMPLE_CODEPILOT=DEBUG
```

## Security Considerations

1. **Never commit secrets to version control**
2. **Use different OAuth apps for different environments**
3. **Regularly rotate JWT secrets**
4. **Use HTTPS in production**
5. **Restrict CORS origins to your actual domains**

## Environment-Specific Notes

### Development
- Uses localhost URLs
- OAuth providers should have localhost redirect URIs
- CORS allows localhost:3000

### Production
- Uses HTTPS URLs
- OAuth providers should have production redirect URIs
- CORS restricted to production domains
- All secrets should be production-grade

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test OAuth flow step by step
4. Ensure OAuth provider settings match your configuration
