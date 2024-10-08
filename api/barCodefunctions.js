import foodapi from './foodApi';

const sendBarCode = async (barCode, selectedMeal, userId, servingSize) => {
  //console.log('sendBarCode', barCode, selectedMeal, userId, servingSize);
  try {
    const response = await foodapi.post('/foodData', {
      barcode: barCode,
      mealName: selectedMeal,
      userId: userId,
      servingSize: servingSize,
    });
    // console.log('response.data in sendBarCode', response.data);
    return response;
  } catch (error) {
    console.error('Failed to send data:', error);
    return false;
  }
};

export { sendBarCode };
