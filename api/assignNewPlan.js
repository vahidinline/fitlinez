import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlanUsage, updateWorkoutPlan } from './GetData';
const savePackages = async (item, userId, navigation) => {
  const addedDateTime = new Date().toISOString();
  const packageId = item._id;

  try {
    const jsonString = JSON.stringify({ item, addedDateTime });
    const res = await getPlanUsage({ packageId, userId });
    try {
      await AsyncStorage.setItem('currentPlanImage', item.image);
    } catch (error) {}
    console.log('newww package saved');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (error) {
    //console.log(error);
  }
};

export { savePackages };
