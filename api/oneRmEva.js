import AsyncStorage from '@react-native-async-storage/async-storage';

function evaluateUserAbility(workouts, gender, weight) {
  let evaluation = {};

  workouts.forEach((workout) => {
    let reps = workout.reps;
    let exercise = workout.exercise;

    if (exercise === 'Push Up') {
      if (gender === 'male') {
        evaluation[exercise] =
          reps <= 10
            ? 'Beginner'
            : reps <= 20
            ? 'Intermediate'
            : reps <= 30
            ? 'Advanced'
            : 'Elite';
      } else {
        evaluation[exercise] =
          reps <= 5
            ? 'Beginner'
            : reps <= 15
            ? 'Intermediate'
            : reps <= 25
            ? 'Advanced'
            : 'Elite';
      }
    }

    if (exercise === 'Body Weight Squat') {
      let level =
        reps <= 20
          ? 'Beginner'
          : reps <= 40
          ? 'Intermediate'
          : reps <= 60
          ? 'Advanced'
          : 'Elite';
      evaluation[exercise] = level;

      // Calculate 1RM using Epley formula
      //let oneRepMax = 0.64 * weight * (1 + 0.0333 * reps);
      // Step 1: Multiply the number of repetitions by 2.5
      let intermediateValue = reps * 2.5;

      // Step 2: Subtract that number from 100
      let percentageOf1RM = 100 - intermediateValue;

      // Step 3: Divide the above number by 100 to get a decimal value
      let decimalValue = percentageOf1RM / 100;

      // Step 4: Divide your bodyweight by the decimal value to find 1RM
      let oneRepMaxRaw = reps < 5 ? 10 : 0.64 * weight * (1 + 0.0333 * reps);

      let oneRepMax = gender === 'male' ? oneRepMaxRaw : oneRepMaxRaw * 0.5;

      AsyncStorage.setItem('oneRM', oneRepMax.toString());

      evaluation[exercise + ' 1RM'] = oneRepMax.toFixed(2);
    }

    if (exercise === 'Dip') {
      if (gender === 'Men') {
        evaluation[exercise] =
          reps <= 5
            ? 'Beginner'
            : reps <= 10
            ? 'Intermediate'
            : reps <= 20
            ? 'Advanced'
            : 'Elite';
      } else {
        evaluation[exercise] =
          reps <= 3
            ? 'Beginner'
            : reps <= 7
            ? 'Intermediate'
            : reps <= 15
            ? 'Advanced'
            : 'Elite';
      }
    }
  });

  return evaluation;
}

export default evaluateUserAbility;
