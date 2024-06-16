import api from './api';

const getDailyTasks = async (userId) => {
  try {
    const tasks = await api.get(`/dailyTask/${userId}`);
    console.log(tasks.data);
    if (tasks.data) {
      return tasks.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const updateDailyTasks = async (userId, taskId) => {};

export { getDailyTasks, updateDailyTasks };
