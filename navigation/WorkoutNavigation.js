import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartSessionIndex from '../screens/WorkoutSession/StartSessionIndex';
import WeeklyPlan from '../screens/WorkoutSession/WeeklyPlan';
import SessionMainPage from '../screens/WorkoutSession/SessionMainPage';
import FinishSession from '../screens/WorkoutSession/FinishSession';
import SahreResult from '../screens/WorkoutSession/SahreResult';

const Stack = createStackNavigator();

const WorkoutNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StartSessionIndex"
        component={StartSessionIndex}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WeeklyPlan"
        component={WeeklyPlan}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="SessionMainPage"
        component={SessionMainPage}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      {/*<Stack.Screen
        name="Item"
        component={Item}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      /> */}
      <Stack.Screen
        name="SahreResult"
        component={SahreResult}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FinishSession"
        component={FinishSession}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default WorkoutNavigator;
