// import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const filterByDates = async (startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const startISO = moment(startDate).toISOString();
    const endISO = moment(endDate).toISOString();
  });
};

const saveUserWeight = async (data) => {
  console.log('data in api', data);
};

const readWorkoutData = async () => {
  console.log('inside read WorkoutData');

  try {
    const value = await AsyncStorage.getItem('workoutsList');
    if (value !== null) {
      const workoutsList = JSON.parse(value);

      const workoutPlanData = workoutsList;
      //console.log('workoutPlanData', workoutPlanData);
      const weeklyPlan = workoutsList?.data.weeklyPlan;
      const planName = workoutsList.data?.packageName;
      const location = workoutsList.data?.location;
      const packageId = workoutsList.data?.packageId;
      // console.log(
      //   'data s in readWorkoutdata',
      //   workoutsList.data?.weeklyPlan.weeklyPlan
      // );
      // console.log(
      //   'workoutPlanData in readWorkoutdata',
      //   workoutPlanData.weeklyPlan
      // );

      return { weeklyPlan, planName, location, packageId };
    } else {
      //console.error('No data in AsyncStorage');
      return null;
    }
  } catch (error) {
    console.error('Failed to read AsyncStorage:', error);
  }
};

const readSavedData = (userId) => {};

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

const readWorkoutPercentageData = async (planName) => {
  try {
    const storedData = await AsyncStorage.getItem('workoutDataPercentage');

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
  readWorkoutData,
  calculateWorkoutPercentage,
  saveUserWeight,
  filterByDates,
};
