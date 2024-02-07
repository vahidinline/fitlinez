import * as SecureStore from 'expo-secure-store';

const key = 'fitlinez-session';
const storeToken = async (authToken) => {
  //console.log('sotre token is: ', authToken);
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(authToken));
  } catch (error) {
    console.log('Error Storing the auth token', error);
  }
};

const updateToken = async (authToken) => {
  //console.log('sotre token is: ', authToken);
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(authToken));
  } catch (error) {
    console.log('Error Storing the auth token', error);
  }
};

const getToken = async () => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.log('Error Getting the auth token', error);
  }
};

const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log('Error Removing the auth token', error);
  }
};

export default { storeToken, getToken, removeToken };
