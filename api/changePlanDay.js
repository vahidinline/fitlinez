import api from './api';

const updatePlanDay = async (userId, title, day) => {
  try {
    const response = await api.put('/changePlanDay', {
      userId,
      title,
      day,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export default updatePlanDay;
