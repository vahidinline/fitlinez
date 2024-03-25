// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jobitta.com',
  //baseURL: 'http://192.168.1.7:8080',
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
