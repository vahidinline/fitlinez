import * as SQLite from 'expo-sqlite';

const totalWeight = SQLite.openDatabase('totalWeight.db');

const saveSetsData = (dataToSave) => {
  //console.log('dataToSave in api', dataToSave);
  totalWeight.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO totalWeight (weight, reps, category, exerciseId, totalWeight, title, itemIndex,timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [
          dataToSave.weight,
          dataToSave.reps,
          dataToSave.category,
          dataToSave.exerciseId,
          dataToSave.totalWeight,
          dataToSave.title,
          dataToSave.itemIndex,
          //dataToSave.timestamp,
          new Date().toISOString(),
        ],

        (_, results) => {
          //console.log('results', results);

          if (results.rowsAffected > 0) {
            // console.log('Data saved successfully');

            // After saving, retrieve the saved data
            tx.executeSql(
              'SELECT * FROM totalWeight WHERE id = ?;', // Replace 'id' with your primary key field
              [results.insertId], // Assuming 'id' is an auto-increment primary key
              (_, results) => {
                const rows = results.rows;
                const savedData = rows.item(0); // Assuming you expect a single row
                //console.log('Saved Data inputApis', savedData);

                // Do something with savedData, e.g., set it in state
              },
              (error) => {
                // console.log('Error retrieving saved data: ' + error.message);
              }
            );
          } else {
            //console.log('Data not saved');
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    (error) => {
      console.log('Transaction error: ' + error.message);
    },
    () => {
      return true;
    }
  );
};

const checkUserRecord = async () => {
  if (defaultReps < reps) {
    const result = await AsyncStorage.getItem(today);
    if (result === null) {
      AsyncStorage.setItem(
        today,
        JSON.stringify([
          {
            title,

            repRecord: defaultReps - reps,
          },
        ])
      );
    } else {
      let data = JSON.parse(result);
      if (!Array.isArray(data)) {
        data = [data];
      }
      const index = data.findIndex(function (item) {
        return item.title === title;
      });
      if (index === -1) {
        data.push({
          title,

          repRecord: defaultReps - reps,
        });
      } else {
        data[exerciseId.$oid] = { reps, title, category };
      }
      AsyncStorage.setItem(today, JSON.stringify(data));
    }
  }
};

export { saveSetsData, checkUserRecord };
