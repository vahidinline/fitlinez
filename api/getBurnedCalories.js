import api from './api';

const getBurnedCalories = async (userId, sessionId) => {
  console.log('sessionId in getBurnedCalories func', sessionId);

  try {
    const response = await api.post(`/bcc/calc/${userId}`, {
      sessionId: sessionId,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send data:', error);
    // ... Implement proper error handling ...
  }
};

export { getBurnedCalories };
