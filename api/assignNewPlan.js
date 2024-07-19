import { getPlanUsage, updateWorkoutPlan } from './GetData';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('packeges.db');
const savePackages = (item, userId, navigation) => {
  const addedDateTime = new Date().toISOString();
  const packageId = item._id;
  // console.log('item in assign new plan', item);
  // console.log('addedDateTime in assign new plan', addedDateTime);
  // console.log('userId in assign new plan', userId);

  try {
    const jsonString = JSON.stringify({ item, addedDateTime });
    getPlanUsage({ packageId, userId });
    db.transaction((tx) => {
      tx.executeSql('INSERT INTO packeges (data) VALUES (?);', [jsonString]);
    });

    console.log('new package saved');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (error) {
    console.log(error);
  }
};

export { savePackages };
