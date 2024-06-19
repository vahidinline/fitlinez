import foodapi from './foodApi';

const approveFoodItem = async (foodId, status) => {
  console.log('foodId in approveFoodItem', foodId, status);

  try {
    const response = await foodapi.put(`/nutritionextractor/update/`, {
      status: status,
      foodId: foodId,
    });
    console.log('response in approveFoodItem', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};
export default approveFoodItem;
