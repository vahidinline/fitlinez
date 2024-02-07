import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PlanPlus from '../components/newPlan/index';
import StartPlan from '../components/newPlan/startPage';
import ListOfExercises from '../components/newPlan/ListOfExercises';
import FinishWorkOut from '../components/newPlan/finishWorkout';
import Handleend from '../components/newPlan/handleEnd';

const Stack = createStackNavigator();

const PlanPlusNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="planPlusIndex"
        component={PlanPlus}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StartPlan"
        component={StartPlan}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="ListOfExercises"
        component={ListOfExercises}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="FinishWorkOut"
        component={FinishWorkOut}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Handleend"
        component={Handleend}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default PlanPlusNavigator;
