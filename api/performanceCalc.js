import AsyncStorage from '@react-native-async-storage/async-storage';

async function calculateTaskCompletionPercentage(tasks, totalTaskCount) {
  // console.log('tasks in performance', tasks);
  //('totalTaskCount in performance', totalTaskCount);
  let uniqueTasks = new Set();
  let completedSubTasks = 0;

  tasks.forEach((task) => {
    uniqueTasks.add(task.exerciseId);
    completedSubTasks += task.type === 'normal' ? 3 : 1;
  });

  let totalSubTasksRequired = totalTaskCount * 3; // Each task includes 3 sub-tasks
  let completionPercentage = (completedSubTasks / totalSubTasksRequired) * 100;

  // Return 100 if completionPercentage is more than 100
  if (completionPercentage > 100) {
    completionPercentage = 100;
  }

  try {
    // Retrieve existing value from AsyncStorage
    const existingValue = await AsyncStorage.getItem('@SessionPerformance');
    //console.log('existingValue', parseFloat(existingValue));
    // If existing value is NaN, null, or undefined, assign 0
    const baseValue =
      existingValue !== null && !isNaN(parseFloat(existingValue))
        ? parseFloat(existingValue)
        : 0;

    // Update the value based on the current completion percentage
    completionPercentage = Math.max(
      baseValue,
      (completedSubTasks / totalSubTasksRequired) * 100
    );

    // Store the updated value into AsyncStorage
    await AsyncStorage.setItem(
      '@SessionPerformance',
      completionPercentage.toFixed(2)
    );
    //console.log('Store Performance done ', completionPercentage.toFixed(2));
  } catch (error) {
    //console.error('Error storing performance:', error.message);
  }

  return completionPercentage.toFixed(2); // Returns a string with 2 decimal places
}

export default calculateTaskCompletionPercentage;
