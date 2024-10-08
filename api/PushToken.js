import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { useEffect } from 'react';
import UserUpdate from '../api/updateUser';
import console from './console';
const PushToken = () => {
  const registerForPushNotifications = async () => {
    const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    try {
      if (!permission.granted) return;
      const token = await Notifications.getExpoPushTokenAsync();
      return token;
    } catch (error) {
      //console.log('Error getting a token', error);
    }
  };

  useEffect(() => {
    registerForPushNotifications();
  }, []);
};

export default PushToken;
