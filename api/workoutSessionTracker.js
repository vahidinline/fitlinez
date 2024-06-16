import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const addSession = async (userId, planId, planName, title, location) => {
  try {
    const response = await api.post(`/workoutsession/add`, {
      userId,
      planId,
      planName,
      title,
      location,
    });
    console.log('response', response.data);
    await AsyncStorage.setItem('sessionId', response.data.sessionId);
    return response.data;
  } catch (error) {
    console.error('Error adding session:', error);
  }
};

const updateSession = async ({ sessionId, status, userId }) => {
  console.log('sessionId', sessionId, 'status', status);

  try {
    const response = await api.put(`/workoutsession/update/${sessionId}`, {
      status,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating session:', error);
  }
};

const userWorkoutHistory = async (userId) => {
  try {
    const response = await api.get(`/workoutsession/get/${userId}`);
    //console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Error reading session:', error);
  }
};

export { addSession, updateSession, userWorkoutHistory };
