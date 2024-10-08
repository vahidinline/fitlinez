import api from './api';

const getUserFirstData = async (userId) => {
  try {
    const response = await api.get(`/userdata/firstassessment/${userId}`);
    if (response.status === 404 || response.status === 500) {
      return null;
    }

    return response.data;
  } catch (error) {
    //  console.log('error', error);
  }
};

export { getUserFirstData };
