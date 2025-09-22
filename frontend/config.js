const ENV = {
  development: {
    API_BASE_URL: 'http://192.168.29.104:5000/api',
  },
  production: {
    API_BASE_URL: 'https://your-production-api-url.com/api',
  },
};

const getEnvVars = (env = 'development') => {
  return ENV[env] || ENV.development;
};

export default getEnvVars;
