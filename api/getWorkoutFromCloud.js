import api from './api';

const GetFromCloud = () => {
  api
    .get('/userworkoutdata', {
      params: {
        userId: userAuth.id,
      },
    })
    .then((res) => {
      setWorkoutData(res.data);
    })
    .then(() => {
      getWorkoutDate();
    })
    .catch((err) => console.log('Error while connecting to backend', err));
};

export default GetFromCloud;
