import api from './api';
import { savePackages } from './assignNewPlan';

const generateWorkoutPlan = async (userId, navigation, setStatus) => {
  // console.log(userId, navigation, setStatus);

  try {
    const res = await createNewPlan(userId);
    setStatus('planCreated');
    if (res) {
      await savePackages(res.data, userId, navigation); // Pass correct response
      setStatus('success');
    } else {
      setStatus('error'); // Handle error state
    }
  } catch (error) {
    console.log('Error in generateWorkoutPlan:', error);
    setStatus('error'); // Update status in case of an error
  }
};

const createNewPlan = async (userId) => {
  // Fix parameter here
  try {
    const res = await api.get(`/generateWorkoutPlan/${userId}`);
    if (res) {
      return res;
    } else {
      return null; // Return null or handle errors accordingly
    }
  } catch (error) {
    console.log('Error in createNewPlan:', error);
    return null; // Return null in case of an error
  }
};

export { createNewPlan, generateWorkoutPlan };
