import api from './api';

const getUserFirstData = async (userId) => {
  try {
    const response = await api.get(`/userdata/firstassessment/${userId}`);

    return response.data;
  } catch (error) {
    console.log('error', error);
  }
};

export { getUserFirstData };
