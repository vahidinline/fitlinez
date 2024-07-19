import api from './api';

const getNewTasks = async (userId, setTaskStatus) => {
  try {
    const tasks = await api.post(`/dailyTask/${userId}`);
    // console.log(tasks.data);
    if (tasks.data) {
      console.log('tasks.data', tasks.data);
      //   reload the page to get the new tasks
      if (tasks.data.length >= 0) {
        setTaskStatus('noTasks');
        return null;
      } else {
        setTaskStatus('success');
        return tasks.data;
      }
    } else {
      setTaskStatus('idle');
      console.log('no tasks data');
      return null;
    }
  } catch (error) {
    return null;
  }
};

export { getNewTasks };
