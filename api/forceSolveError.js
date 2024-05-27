import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStorage from './storage';
import * as Updates from 'expo-updates';

const forceSolveError = async (setUserAuth) => {
  setUserAuth(null);
  AuthStorage.removeToken();
  Updates.reloadAsync();
};

const clearAllAsyncCache = async () => {
  await AsyncStorage.clear();
  //reload the app
  Updates.reloadAsync();

  console.log('AsyncStorage cleared');
};

export { forceSolveError, clearAllAsyncCache };
