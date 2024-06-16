import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
import { Alert } from 'react-native';

const getUsercurrentWorkoutPlan = async (userId) => {
  const addedDateTime = new Date().toISOString();
  try {
    const result = await api.get(`newplan/currentPlan/${userId}`);
    const data = result.data[0];
    if (result.data) {
      await AsyncStorage.setItem(
        'workoutsList',
        JSON.stringify({ data, addedDateTime })
      ).then(() => {
        console.log('new package saved');
        Alert.alert(
          'Success',
          'Your current plan has been updated successfully'
        );
      });
    }
  } catch (error) {
    return null;
  }
};

export { getUsercurrentWorkoutPlan };
