// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fitlinez-backend.lm.r.appspot.com',
  //office local
  //baseURL: 'http://10.10.178.1:8080',
  //home local
  //baseURL: 'http://192.168.1.67:8080',
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

export default api;
