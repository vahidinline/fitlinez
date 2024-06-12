import { Platform } from 'react-native';
import api from './api';

const appUpdateTrack = async (userId) => {
  const userDevice = Platform.OS;
  const appVersion = '1.26.6';

  try {
    const response = await api.post(`/appUpdateRecord/${userId}`, {
      userId: userId ? userId : 'anonymous',
      appVersion: appVersion,

      userDevice: userDevice,
    });
  } catch (error) {
    console.error(error);
  }
};

export default appUpdateTrack;
