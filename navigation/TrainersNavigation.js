import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Trainers from '../components/trainsers';

const Stack = createStackNavigator();

const TrainersNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="trainers"
        component={Trainers}
        options={{
          headerShown: false,
        }}
      />
      {/* <Stack.Screen
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
      /> */}
    </Stack.Navigator>
  );
};

export default TrainersNavigator;
