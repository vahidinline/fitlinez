import api from './api';

const getHeaderReport = async (userId, userLanguage) => {
  // const key = 'fitlinez-session';
  console.log('userLanguage in get header report', userId);
  try {
    let response = await api.post(`/workoutsession/usage/${userId}`, {
      data: {
        userLanguage: userLanguage,
      },
    });
    // headers: {
    //     Authorization: `Bearer ${key}`,
    // },
    // console.log('response', response.data);
    return response.data;
  } catch (error) {
    console.log('error getting userId', error);
  }
};

export { getHeaderReport };
