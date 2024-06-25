import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { Alert } from 'react-native';

const getUsercurrentWorkoutPlan = async (userId, i18n) => {
  // console.log('getUsercurrentWorkoutPlan', userId);
  const addedDateTime = new Date().toISOString();
  try {
    const result = await api.get(`newplan/currentPlan/${userId}`);
    const data = result.data[0];
    if (result.data) {
      await AsyncStorage.setItem(
        'workoutsList',
        JSON.stringify({ data, addedDateTime })
      ).then(() => {
        console.log('workoutsList');
        Alert.alert(i18n.t('updatesuccess'), i18n.t('updateSuccessMessage'));
      });
    } else {
      console.log('no workoutsList');
      Alert.alert(i18n.t('updateError'), i18n.t('updateErrorMessage'));
    }
  } catch (error) {
    return null;
  }
};

export { getUsercurrentWorkoutPlan };
