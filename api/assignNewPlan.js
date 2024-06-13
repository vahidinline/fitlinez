import { updateWorkoutPlan } from './GetData';
import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('packeges.db');
const savePackages = (item, userId, navigation) => {
  const addedDateTime = new Date().toISOString();

  console.log('item', item);
  console.log('addedDateTime', addedDateTime);
  console.log('userId', userId);

  try {
    const jsonString = JSON.stringify({ item, addedDateTime });
    updateWorkoutPlan(item, addedDateTime, userId);
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
