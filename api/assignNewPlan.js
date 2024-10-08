import { getPlanUsage, updateWorkoutPlan } from './GetData';
const savePackages = async (item, userId, navigation) => {
  const addedDateTime = new Date().toISOString();
  const packageId = item._id;
  // console.log('item in assign new plan', item);
  // console.log('addedDateTime in assign new plan', addedDateTime);
  //console.log('userId in assign new plan', userId);

  try {
    const jsonString = JSON.stringify({ item, addedDateTime });
    const res = await getPlanUsage({ packageId, userId });

    // console.log('new package saved');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (error) {
    //console.log(error);
  }
};

export { savePackages };
