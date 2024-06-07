import api from './api';

const getUserFirstData = async (userId) => {
  const response = await api.get(`/userdata/firstassessment/${userId}`);
  return response.data;
};

export { getUserFirstData };
