import axios from 'axios';

const getPackages = async () => {
  try {
    const response = await axios.get('https://jobitta.com/newplan/prebuild');

    return response.data;
  } catch (error) {
    console.log(error);
    return null; // or throw error if you want to handle it in the calling function
  }
};

export default getPackages;
