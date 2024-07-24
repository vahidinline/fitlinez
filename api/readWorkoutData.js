import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
const db = SQLite.openDatabase('totalWeight.db');
const db1 = SQLite.openDatabase('performance.db');
const db2 = SQLite.openDatabase('packeges.db');
const db3 = SQLite.openDatabase('userWorkOutSession.db');
const db4 = SQLite.openDatabase('userBasicData.db');

const filterByDates = async (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    //console.log('Filtering data between', startDate, 'and', endDate);

    // Convert dates to ISO format for consistency
    const startISO = moment(startDate).toISOString();
    const endISO = moment(endDate).toISOString();

    db1.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM performance WHERE date BETWEEN ? AND ?',
          [startISO, endISO],

          (tx, results) => {
            let filteredData = [];
            for (let i = 0; i < results.rows.length; i++) {
              filteredData.push(results.rows.item(i));
            }

            //console.log('filteredData', filteredData);
            resolve(filteredData); // This line was previously commented out
          },
          (error) => {
            reject('Fetch error: ', error);
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
      }
    );
  });
};

const saveUserWeight = async (data) => {
  console.log('data in api', data);

  db4.transaction(
    (tx) => {
      tx.executeSql(
        'INSERT INTO userBasicData (data) VALUES (?);',
        [JSON.stringify(data)],
        () => {
          console.log('data inserted');
        },
        (error) => {
          console.log('error in data insertion', error);
        }
      );
    },
    (error) => {
      console.log('main error in data insertion', error);
    }
  );
};

const readWorkoutData = async () => {
  console.log('inside read WorkoutData');

  try {
    const value = await AsyncStorage.getItem('workoutsList');
    if (value !== null) {
      const workoutsList = JSON.parse(value);

      const workoutPlanData = workoutsList;
      console.log('workoutPlanData in readWorkoutdata', workoutsList);
      const weeklyPlan = workoutsList.data?.weeklyPlan;
      const planName = workoutsList.data?.packageName;
      const location = workoutsList.data?.location;
      // const totalSession = workoutsList.data?.totalSessions
      //   ? workoutsList.data.totalSessions
      //   : workoutsList.data?.DaysPerWeek * workoutsList.data.duration;
      console.log('weeklyPlan in readWorkoutData', weeklyPlan);
      console.log('planName in readWorkoutData', planName);
      return { weeklyPlan, planName, location };
      // return {
      //   dataObject: dataObject.data,
      //   totalSessions: dataObject.item.DaysPerWeek * dataObject.item.duration,
      // };
    } else {
      //console.error('No data in AsyncStorage');
      return null;
    }
  } catch (error) {
    console.error('Failed to read AsyncStorage:', error);
  }
};

const readSavedData = (userId) => {
  // console.log('userId in api', userId);
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tx.executeSql(
          'SELECT * FROM totalWeight WHERE timestamp >= ?;',
          [today.getTime()],
          (tx, results) => {
            const rows = results.rows;

            const data = [];

            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);

              data.push({
                ...row,
                userId: userId,
              });
            }

            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const PerformanceRead = (userId) => {
  //console.log('userId', userId);
  return new Promise((resolve, reject) => {
    db1.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM performance;',
          [],
          (tx, results) => {
            const rows = results.rows;

            const data = [];

            for (let i = 0; i < rows.length; i++) {
              let row = rows.item(i);
              data.push({
                ...row,
                userId: userId,
              });
            }

            resolve(data);
          },
          (error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const currentPalnPercentage = () => {
  return new Promise((resolve, reject) => {
    db3.transaction(
      (tx) => {
        // Check if the userWorkOutSession table exists
        tx.executeSql(
          'SELECT name FROM sqlite_master WHERE type="table" AND name="userWorkOutSession";',
          [],
          (_, result) => {
            const tableExists = result.rows.length > 0;

            if (tableExists) {
              // Proceed with the transaction if the table exists
              tx.executeSql(
                'SELECT * FROM userWorkOutSession;',
                [],
                (tx, results) => {
                  const rows = results.rows;
                  const data = [];

                  for (let i = 0; i < rows.length; i++) {
                    let row = rows.item(i);
                    data.push({
                      ...row,
                    });
                  }

                  resolve({
                    data: data,
                    totalSessions: data.DaysPerWeek * data.Weeks,
                  });
                },
                (error) => {
                  reject(error);
                }
              );
            } else {
              // Table does not exist
              resolve(null);
            }
          },
          (error) => {
            reject(error);
          }
        );
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// const currentPalnPercentage = () => {
//   console.log('inside currentPlanPercentage');
//   return new Promise((resolve, reject) => {
//     db3.transaction(
//       (tx) => {
//         tx.executeSql(
//           'SELECT * FROM userWorkOutSession;',
//           [],
//           (tx, results) => {
//             const rows = results.rows.raw(); // get rows in a simpler format
//             console.log('rows in currentPlanPercentage', rows);
//             const data = [];
//             let totalSessions = 0;

//             for (let i = 0; i < rows.length; i++) {
//               let row = rows[i];
//               data.push(row);

//               totalSessions += row.DaysPerWeek * row.Weeks; // Calculate totalSessions for each row
//             }

//             resolve({
//               data: data,
//               totalSessions: totalSessions,
//             });
//           },
//           (error) => {
//             reject('error in currentPlanPercentage line217 ', error);
//           }
//         );
//       },
//       (error) => {
//         reject('error in currentPlanPercentage line 226', error);
//       },
//       () => {
//         console.log('Read transaction completed successfully.');
//       }
//     );
//   });
// };

// const calculateWorkoutPercentage = (total, startDate, done, planName) => {
//   const percentage = (done / total) * 100;
//   console.log('percentage', percentage);

//   return percentage;
// };

const calculateWorkoutPercentage = async (total, startDate, done, planName) => {
  console.log(
    'data into calculateWorkoutPercentage api',
    total,
    startDate,
    done,
    planName
  );
  const startDateObj = new Date(startDate);
  // filter the inputArray for items with timestamp after startDate
  const filteredArray = done?.filter(
    (item) => new Date(item.timestamp) > startDateObj
  );

  console.log(
    'Length of array with timestamps after startDate',
    filteredArray?.length
  );

  // Ensure filteredArray is defined before accessing its length property
  const arrayLength = filteredArray?.length || 0;

  let percentage = (arrayLength / total) * 100;
  let finalPercentage = percentage > 100 ? 100 : percentage.toFixed(2);
  //console.log('percentage in 177', finalPercentage);
  let storedData = null;

  // Fetching the stored data
  try {
    storedData = await AsyncStorage.getItem('workoutDataPercentage');
    if (storedData !== null) {
      const workoutData = JSON.parse(storedData);
      //console.log('workoutData line 278', workoutData);

      // If startDate or planName has changed, reset the percentage
      if (
        workoutData[planName] &&
        (workoutData[planName].startDate !== startDate ||
          workoutData[planName].planName !== planName)
      ) {
        finalPercentage = 0;
        //console.log('percentage became 0', finalPercentage);
      }
    }
  } catch (error) {
    console.error('Error fetching data', error);
  }

  //console.log('percentage in line 183', finalPercentage);

  // Storing the workout data in AsyncStorage
  try {
    const workoutData = {
      ...(storedData ? JSON.parse(storedData) : {}),
      [planName]: {
        planName: planName,
        startDate: startDate,
        percentage: finalPercentage,
      },
    };

    await AsyncStorage.setItem(
      'workoutDataPercentage',
      JSON.stringify(workoutData)
    );
  } catch (error) {
    console.error('Error saving data', error);
  }
  console.log('finalPercentage', finalPercentage);
  return finalPercentage;
};

// const calculateWorkoutPercentage = async (total, startDate, done, planName) => {
//   try {
//     console.log(
//       'Calculating workout percentage:',
//       total,
//       startDate,
//       done,
//       planName
//     );

//     const startDateObj = new Date(startDate);
//     const filteredArray = done?.filter(
//       (item) => new Date(item.timestamp) > startDateObj
//     );

//     console.log(
//       'Length of array with timestamps after startDate:',
//       filteredArray?.length
//     );

//     const arrayLength = filteredArray?.length || 0;

//     let percentage = (arrayLength / total) * 100;
//     let finalPercentage = Math.min(100, percentage.toFixed(2));
//     console.log('Calculated percentage:', finalPercentage);

//     let storedData = null;

//     try {
//       storedData = await AsyncStorage.getItem('workoutDataPercentage');
//       console.log('Stored data from AsyncStorage:', storedData);

//       let workoutData = storedData ? JSON.parse(storedData) : {};

//       if (
//         workoutData[planName] &&
//         typeof workoutData[planName] === 'object' &&
//         workoutData[planName].startDate === startDate &&
//         workoutData[planName].planName === planName
//       ) {
//         // If startDate and planName are the same, use the stored percentage
//         finalPercentage = workoutData[planName].percentage;
//       } else {
//         // Reset the percentage and update workoutData
//         finalPercentage = 0;
//         workoutData[planName] = {
//           planName: planName,
//           startDate: startDate,
//           percentage: finalPercentage,
//         };
//       }

//       storedData = JSON.stringify(workoutData);
//     } catch (error) {
//       console.error('Error fetching or parsing data from AsyncStorage:', error);
//     }

//     // Store the workout data in AsyncStorage
//     try {
//       await AsyncStorage.setItem('workoutDataPercentage', storedData);
//       console.log('Workout data stored in AsyncStorage:', storedData);
//     } catch (error) {
//       console.error('Error saving data to AsyncStorage:', error);
//     }

//     return finalPercentage;
//   } catch (error) {
//     console.error('Error in calculateWorkoutPercentage:', error);
//     throw error;
//   }
// };

const readWorkoutPercentageData = async (planName) => {
  try {
    const storedData = await AsyncStorage.getItem('workoutDataPercentage');
    // console.log(
    //   'Stored data from AsyncStorage readWorkoutPercentageData:',
    //   storedData
    // );
    if (storedData !== null) {
      const workoutData = JSON.parse(storedData);

      if (workoutData[planName] && workoutData[planName] !== null) {
        const { startDate, percentage } = workoutData[planName];
        return { startDate, percentage, planName };
      }
    }
  } catch (error) {
    console.error('Error reading data', error);
  }

  return null;
};

const generateHeaderText = (startDate, done, i18n, planName) => {
  const startDateObj = new Date(startDate);
  const filteredArray = done?.filter(
    (item) => new Date(item.timestamp) > startDateObj
  );

  if (!filteredArray || filteredArray.length === 0) {
    return { status: 'bad', message: i18n.t('notStartedPlan') };
  } else {
    const arrayLength = filteredArray.length;

    if (arrayLength === 1) {
      // Add your specific condition for array length 1 here
      // For example:
      return { status: 'custom', message: i18n.t('justdonefirstsession') };
    } else if (arrayLength > 1) {
      const lastTwoTimestamps = filteredArray
        .slice(-2)
        .map((item) => new Date(item.timestamp));

      if (lastTwoTimestamps.length === 2) {
        const timeGap = lastTwoTimestamps[1] - lastTwoTimestamps[0];
        const daysGap = timeGap / (1000 * 60 * 60 * 24);

        if (daysGap > 4) {
          return { status: 'bad', message: i18n.t('youveBeenInconsistent') };
        } else {
          return {
            status: 'good',
            message: i18n.t('followedPlanInARow', {
              planName: planName,
              count: arrayLength,
            }),
          };
        }
      } else {
        return { status: 'bad', message: i18n.t('youveshouldHaveConsistency') };
      }
    } else {
      return { status: 'bad', message: i18n.t('youveshouldHaveConsistency') };
    }
  }
};

// Example usage:

export {
  generateHeaderText,
  readWorkoutPercentageData,
  readSavedData,
  PerformanceRead,
  readWorkoutData,
  currentPalnPercentage,
  calculateWorkoutPercentage,
  saveUserWeight,
  filterByDates,
};
