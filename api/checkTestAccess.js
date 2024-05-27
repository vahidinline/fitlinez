import api from './api';

const checkUserAccess = async (userId) => {
  try {
    const res = await api.post(`/accessTest/${userId}`);
    return res.data.status;
  } catch (error) {
    console.log('Error: ', error);
  }
};

export { checkUserAccess };
