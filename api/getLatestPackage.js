import api from './api';

const getPackages = async () => {
  try {
    const response = await api.get('/newplan/prebuild');

    return response.data;
  } catch (error) {
    // console.log(error);
    return null; // or throw error if you want to handle it in the calling function
  }
};

export default getPackages;
