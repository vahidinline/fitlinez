import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage if not already imported

export const SessionCounter = async () => {
  const today = new Date().toISOString().substring(0, 10);

  const data = await AsyncStorage.getItem('NumberofWorkOutDone');

  if (data !== null) {
    const parsedData = JSON.parse(data);

    const { count } = parsedData;

    AsyncStorage.setItem(
      `NumberofWorkOutDone`,
      JSON.stringify({
        count: count + 1,
      })
    ).then(() => {
      return parsedData.count;
    });
  } else {
    AsyncStorage.setItem(
      `NumberofWorkOutDone`,
      JSON.stringify({ count: 1 })
    ).then(() => {
      return 1;
    });
  }
};
