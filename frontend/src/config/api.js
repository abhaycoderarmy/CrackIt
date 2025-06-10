// // src/config/api.js
// const config = {
//   development: {
//     API_BASE_URL: "http://localhost:8000/api/v1"
//   },
//   production: {
//     API_BASE_URL: "https://your-production-api.com/api/v1"
//   }
// };

// const currentConfig = config[process.env.NODE_ENV] || config.development;

// export const EMAIL_API_END_POINT = `${currentConfig.API_BASE_URL}/send-email`;

// src/config/api.js
const getApiBaseUrl = () => {
  // Use Vite environment variable if available
  if (import.meta.env.VITE_BACKEND_URL) {
    return `${import.meta.env.VITE_BACKEND_URL}/api/v1`;
  }
  
  // Fallback based on environment
  if (import.meta.env.PROD) {
    return "https://your-production-api.com/api/v1";
  }
  
  // Development fallback
  return "http://localhost:5000/api/v1";
};

const API_BASE_URL = getApiBaseUrl();

export const EMAIL_API_END_POINT = `${API_BASE_URL}/send-email`;