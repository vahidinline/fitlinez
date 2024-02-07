import axios from 'axios';

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

  const response = await axios.post(
    'https://jobitta.com/sessionfeedback',
    //'http://172.20.10.6:8080/sessionfeedback',
    data
  );
  console.log(response.data);
  return response.data;
};
