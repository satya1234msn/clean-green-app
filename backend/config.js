const ENV = {
  development: {
    // Frontend URLs for CORS
    FRONTEND_URLS: [
      'http://localhost:3000',
      'http://192.168.29.56:3000',
      'http://127.0.0.1:3000',
      'exp://192.168.29.56:8081',
      'exp://127.0.0.1:8081',
    ],
    // Backend server configuration
    SERVER: {
      PORT: 5000,
      HOST: '192.168.29.56', // Change this to your IP address
    },
    // Database configuration
    DATABASE: {
      URL: 'mongodb://localhost:27017/clean-green-app', // Change if needed
    },
    // JWT configuration
    JWT: {
      SECRET: 'your-super-secret-jwt-key-change-in-production',
      EXPIRES_IN: '7d',
    },
    // File upload configuration
    UPLOAD: {
      MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    },
  },
  production: {
    FRONTEND_URLS: [
      'https://your-production-frontend-url.com',
    ],
    SERVER: {
      PORT: process.env.PORT || 5000,
      HOST: process.env.HOST || '0.0.0.0',
    },
    DATABASE: {
      URL: process.env.MONGODB_URI || 'mongodb://localhost:27017/clean-green-app',
    },
    JWT: {
      SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      EXPIRES_IN: '7d',
    },
    UPLOAD: {
      MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
      ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
    },
  },
};

const getEnvVars = (env = process.env.NODE_ENV || 'development') => {
  return ENV[env] || ENV.development;
};

// Helper function to get current environment
const getCurrentEnv = () => {
  return process.env.NODE_ENV || 'development';
};

// Helper function to check if running in production
const isProduction = () => {
  return getCurrentEnv() === 'production';
};

// Helper function to get server URL
const getServerURL = () => {
  const env = getCurrentEnv();
  const config = getEnvVars(env);
  const { HOST, PORT } = config.SERVER;

  if (isProduction()) {
    return `https://${HOST}:${PORT}`;
  }

  return `http://${HOST}:${PORT}`;
};

// Helper function to get API base URL
const getAPIBaseURL = () => {
  return `${getServerURL()}/api`;
};

module.exports = {
  getEnvVars,
  getCurrentEnv,
  isProduction,
  getServerURL,
  getAPIBaseURL,
  ENV,
};
