import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { Alert } from 'react-native';

const getUsercurrentWorkoutPlan = async (userId, i18n) => {
  console.log('getUsercurrentWorkoutPlan', userId);
  const addedDateTime = new Date().toISOString();
  try {
    const result = await api.get(`newplan/currentPlan/${userId}`);
    //console.log('getUsercurrentWorkoutPlan', result.data);
    const data = result.data;
    if (result.data) {
      await AsyncStorage.setItem('workoutsList', JSON.stringify(data)).then(
        () => {
          //console.log('workoutsList in getUsercurrentWorkoutPlan', data);
        }
      );
    } else {
      console.log('no workoutsList');
      Alert.alert(i18n.t('updateError'), i18n.t('updateErrorMessage'));
    }
  } catch (error) {
    return null;
  }
};

export { getUsercurrentWorkoutPlan };
