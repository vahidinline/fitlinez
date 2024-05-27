import foodapi from './foodApi';

const setDailyCaloriesGoals = async (
  dailyCalories,
  fatPercentage,
  proteinPercentage,
  carbsPercentage,
  fatGrams,
  proteinGrams,
  carbsGrams,
  userId
) => {
  try {
    const response = await foodapi.post('/calories/api/daily-goal/', {
      dailyCalories,
      fatPercentage,
      proteinPercentage,
      carbsPercentage,
      fatGrams,
      proteinGrams,
      carbsGrams,
      userId,
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};
export { setDailyCaloriesGoals };
