import api from './api';

const checkUserAccess = async (userId) => {
  try {
    const res = await api.post(`/accessTest/${userId}`);
    console.log('res for access test: ', res.data.status);
    return res.data.status;
  } catch (error) {
    console.log('Error: ', error);
  }
};

export { checkUserAccess };
