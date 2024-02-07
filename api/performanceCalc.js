function calculateTaskCompletionPercentage(tasks, totalTaskCount) {
  // console.log('tasks', tasks);
  let uniqueTasks = new Set();
  let completedSubTasks = 0;

  tasks.forEach((task) => {
    uniqueTasks.add(task.exerciseId);
    completedSubTasks += task.type === 'normal' ? 3 : 1;
  });

  let totalSubTasksRequired = totalTaskCount * 3; // Each task includes 3 sub-tasks
  let completionPercentage = (completedSubTasks / totalSubTasksRequired) * 100;

  //retun 100 if completionPercentage more than 100
  if (completionPercentage > 100) {
    return 100;
  }
  // Returns a string with 2 decimal places
  //console.log('completionPercentage', completionPercentage);
  return completionPercentage.toFixed(2); // Returns a string with 2 decimal places
}

export default calculateTaskCompletionPercentage;
