import foodapi from './foodApi';

const getDailyCaloriesDetails = async (userId, date) => {
  // console.log('userId in getDailyCaloriesDetails', userId);
  //console.log('date in getDailyCaloriesDetails', date);
  try {
    const res = await foodapi.get(`/dailyCaloriesDetails/`, {
      params: {
        userId,
        date,
      },
    });
    //console.log('res in getDailyCaloriesDetails', res.data);
    return res.data;
  } catch (err) {
    //  console.log(err);
  }
};

export default getDailyCaloriesDetails;
