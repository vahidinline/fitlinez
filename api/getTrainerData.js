import api from './api';

const getListOfTrainers = async () => {
  try {
    const result = await api.get('/trainer');
    return result.data;
  } catch (e) {
    //console.log(e);
  }
};

const getTrainerPlans = async ({ trainerId }) => {
  // console.log('trainerId', trainerId);
  try {
    const result = await api.post(`/newPlan/trainersPlans`, {
      trainerId: trainerId,
    });
    return result.data;
  } catch (e) {
    //  console.log(e);
  }
};

export { getListOfTrainers, getTrainerPlans };
