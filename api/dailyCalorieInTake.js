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

export { getDailyCalorieInTake };
