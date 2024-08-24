import foodapi from './foodApi';

const sendInitialReq = async (userInput, userId, selectedMeal, setStatus) => {
  //setStatus('initialReqSent');
  console.log(
    'selectedMeal in sendInitialReq',
    userInput,
    userId,

    selectedMeal
  );

  try {
    const response = await foodapi.post(
      //'https://aibackendfitlinez.azurewebsites.net/nutritionextractor',
      '/nutritionextractor',
      { userInput, userId, selectedMeal }
    );
    // console.log('response in sendInitialReq', response.data);
    // console.log(
    //   'response in sendInitialReq',
    //   response.data.currentFood.foodItems
    // );
    return response;
  } catch (error) {
    setStatus('error');
    console.log('Failed to send data:', error);
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
    //console.log('response in sendfoodQuery', response.data.nutritionFacts);

    return {
      data: response.data.nutritionFacts,
      mealId: response.data.mealId,
    };
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

const deleteFoodItem = async (mealId) => {
  try {
    const response = await foodapi.put(`/nutritionextractor/update/`, {
      status: 'delete',
      mealId: mealId,
    });
    //console.log('response in sendfoodQuery', response.data.nutritionFacts);

    //console.log('response in deleteFoodItem', response.data);
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

export { sendFoodQuery, sendInitialReq, selectMeal, deleteFoodItem };
