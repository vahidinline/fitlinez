import axios from 'axios';
import { showMessage } from 'react-native-flash-message';

const api = axios.create({
  baseURL: 'https://server.fitlinez.com',
  // office local
  // baseURL: 'http://10.10.178.1:8080',
  // home local
  // baseURL: 'http://192.168.1.67:8080',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth key if provided
api.interceptors.request.use(
  (config) => {
    if (config.authKey) {
      config.headers['Authorization'] = `Bearer ${config.authKey}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      showMessage({
        message: 'Network Error',
        description: 'Please check your internet connection.',
        type: 'danger',
        icon: 'auto',
      });
    } else {
      // Other errors
      showMessage({
        message: `Error ${error.response.status}`,
        description: error.response.data.message || 'An error occurred',
        type: 'danger',
        icon: 'auto',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
