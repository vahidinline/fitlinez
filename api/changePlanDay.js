import api from './api';

const updatePlanDay = async (userId, title, day) => {
  // console.log('userId', userId);
  // console.log('title', title);
  // console.log('day', day);
  try {
    const response = await api.put('/newPlan/singleDay', {
      userId,
      title,
      day,
    });

    //update the plan day in async storage

    // console.log('response', response);
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default updatePlanDay;
