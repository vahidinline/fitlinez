import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const foodapi = axios.create({
  //baseURL: 'http://10.10.177.210:8090',
  baseURL: 'https://aibackendfitlinez.azurewebsites.net',

  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// I made a pizza with following items: 130 grams of mozzarella , 50 grams of chicken breast, 100 grams of wheat flour, 50 grams of tomato parseTrigger, 10 grams of olieve oil
// Interceptor to add auth key if provided
foodapi.interceptors.request.use(
  async (config) => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      return Promise.reject('No Internet Connection');
    }

    if (config.authKey) {
      config.headers['Authorization'] = `Bearer ${config.authKey}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default foodapi;
