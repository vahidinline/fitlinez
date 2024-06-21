import api from './api';

const getNewTasks = async (userId, setStatus) => {
  console.log('userId in getNewTasks', userId);
  try {
    const tasks = await api.post(`/dailyTask/${userId}`);
    console.log(tasks.data);
    if (tasks.data) {
      //console.log('tasks.data', tasks.data);
      //   reload the page to get the new tasks

      return tasks.data;
    } else {
      console.log('no tasks data');
      return null;
    }
  } catch (error) {
    return null;
  }
};

export { getNewTasks };
