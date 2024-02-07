import * as SQLite from 'expo-sqlite';
const UserWorkOutSessionDB = SQLite.openDatabase('userWorkOutSession.db');
const performanceDB = SQLite.openDatabase('performance.db'); // Replace with your actual database name

const saveUserData = (
  category,
  location,
  timeSpent,
  totalWeightSum,
  completionPercentage
) => {
  console.log('inside saveUserData');
  const dataToSave = {
    category: category,
    location: location,
    timeSpent: timeSpent,
    totalWeightSum,
    performance: completionPercentage,
  };
  try {
    UserWorkOutSessionDB.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO userWorkOutSession (data) VALUES (?);',
        [JSON.stringify(dataToSave)],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            return true;
          } else {
            return false;
          }
        }
      );
    });
    console.log('dataToSave in finish page ', dataToSave);
  } catch (error) {
    console.log(error);
  }
};

const retrieveAndCalculatePerformance = (
  category,
  location,
  timeSpent,
  completionPercentage,
  today
) => {
  console.log('inside retrieveAndCalculatePerformance');
  performanceDB.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO performance ( category, location, timeSpent, performance, date) VALUES ( ?, ?, ?, ?,?);',
        [category, location, timeSpent, completionPercentage, today]
      );

      //check if the data is inserted
    },
    (error) => {
      console.log('Transaction error:', error);
    },
    () => {
      //     console.log('Transaction completed successfully');
    }
  );
};

export { saveUserData, retrieveAndCalculatePerformance };
