import axios from 'axios';
import foodapi from './foodApi';

const getDailyCalorieInTake = async (userId) => {
  console.log('userId in func', userId);
  try {
    const response = await foodapi.get(
      `/nutritionextractor/dailyreport/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

const getCustomCalorieInTakeReport = async (userId, startDate, endDate) => {
  try {
    const response = await foodapi.get(
      `/nutritionextractor/customreport/${userId}`,
      {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
      }
    );
    let responseData = response.data;
    if (typeof responseData === 'string') {
      responseData = JSON.parse(responseData);
    }
    console.log('responseData', responseData);
    return responseData;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

export { getDailyCalorieInTake, getCustomCalorieInTakeReport };
