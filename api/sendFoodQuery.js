import foodapi from './foodApi';

const sendInitialReq = async (userInput) => {
  try {
    const response = await foodapi.post(
      //'https://aibackendfitlinez.azurewebsites.net/nutritionextractor',
      '/nutritionextractor',
      { userInput }
    );
    //console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

const selectMeal = async (meal, userId) => {
  try {
    const response = await foodapi.post('/nutritionextractor/add', {
      meal,
      userId,
    });
    //console.log('response', response.data.fooditems);
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

const sendFoodQuery = async (foodItems, userId, selectedMeal) => {
  try {
    const response = await foodapi.post('/nutritionextractor/addfood', {
      foodItems,
      userId,
      selectedMeal,
    });
    console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

export { sendFoodQuery, sendInitialReq, selectMeal };
