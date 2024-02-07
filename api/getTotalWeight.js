import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabase('totalWeight.db'); // Replace with your actual database name

const getTotalWeight = ({ category, today }) => {
  console.log('category', category);
  console.log('today', today);
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx, result) => {
        tx.executeSql(
          'SELECT SUM(totalWeight) as totalWeightSum FROM totalWeight WHERE category = ? AND date(timestamp) = ?;',
          // 'SELECT * FROM totalWeight WHERE category = ? AND date(timestamp) = ?;',
          [category, today],
          (tx, results) => {
            // console.log('results in getTotalWeight', results);
            if (results.rows.length > 0) {
              const sum = results.rows.item(0).totalWeightSum;

              resolve(sum);
              console.log('sum in getTotalWeight', sum);
            } else {
              console.log('No rows found in the response');
              resolve(0);
            }
          },
          (tx, error) => {
            console.log('Error executing SQL query:', error);
            reject(error);
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

export default getTotalWeight;
