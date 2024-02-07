import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('totalWeight.db'); // Replace with your actual database name

const getAllWorkoutHistory = () => {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM totalWeight;',
          [],
          (_, results) => {
            if (results.rows.length > 0) {
              //console.log('results in getAllWorkoutHistory', results);
              resolve(results);
            } else {
              console.log('No rows found in the response');
              resolve({ rows: { _array: [], length: 0 } });
            }
          },
          (_, error) => {
            console.log('Error executing SQL query:', error);
            reject(error);
            return true;
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
        reject(error);
      },
      () => {
        console.log('Transaction completed successfully');
      }
    );
  });
};

export default getAllWorkoutHistory;
