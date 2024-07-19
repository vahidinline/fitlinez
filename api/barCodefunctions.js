import foodapi from './foodApi';

const sendBarCode = async (barCode, selectedMeal, userId) => {
  console.log('sendBarCode', barCode, selectedMeal.value, userId);
  try {
    const response = await foodapi.post('/foodData', {
      barcode: barCode,
      mealName: selectedMeal.value,
      userId: userId,
    });
    // console.log('response.data in sendBarCode', response.data);
    return response;
  } catch (error) {
    console.error('Failed to send data:', error);
    return false;
  }
};

export { sendBarCode };
