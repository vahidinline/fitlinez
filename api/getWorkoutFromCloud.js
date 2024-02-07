import axios from 'axios';

const GetFromCloud = () => {
  axios
    .get('https://jobitta.com/userworkoutdata', {
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
