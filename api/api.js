// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jobitta.com',
  //office local
  // baseURL: 'http://10.10.177.234:8080',
  //home local
  // baseURL: 'http://192.168.1.66:8080',
  timeout: 20000,
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

export default api;
