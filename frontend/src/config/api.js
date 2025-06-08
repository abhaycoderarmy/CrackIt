// src/config/api.js
const config = {
  development: {
    API_BASE_URL: "http://localhost:8000/api/v1"
  },
  production: {
    API_BASE_URL: "https://your-production-api.com/api/v1"
  }
};

const currentConfig = config[process.env.NODE_ENV] || config.development;

export const EMAIL_API_END_POINT = `${currentConfig.API_BASE_URL}/send-email`;