import api from './api';

export const sendUserFeedback = async (
  { userId, value, category, location, timeSpent, performance } // assuming performance is also an argument of this function
) => {
  const data = {
    userId: userId,
    value: value,
    category: category,
    location: location,
    timeSpent: timeSpent,
    performance: performance,
  };

  const response = await api.post(
    '/sessionfeedback',

    data
  );
  console.log(response.data);
  return response.data;
};
