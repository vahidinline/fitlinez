import AsyncStorage from '@react-native-async-storage/async-storage';
//import { saveSetsData } from './inputApis';

const storeDataDB = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@current_exercise_state');

    if (jsonValue) {
      const currentExerciseState = JSON.parse(jsonValue);

      // Add a delay to ensure FlatList is fully loaded.
      // setTimeout(() => {
      //   saveSetsData(currentExerciseState);
      // }, 1000); // Adjust delay as needed.

      // Dispatch action or call function to resume set. Depends on your implementation.
    }
  } catch (error) {
    console.error('Error loading exercise state', error);
  }
};

export default storeDataDB;
