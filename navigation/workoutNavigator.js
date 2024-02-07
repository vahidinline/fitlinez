import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DailyPlan from '../components/Workout/dailyPlan';
import Details from '../components/Workout/details';
import LoginScreen from '../screens/Login';
import WelcomeScreen from '../screens/welcome';
import Start from '../screens/start';

import RegisterScreen from '../screens/Register';

import SyncData from '../api/SyncData';
import WeeklyCal from '../screens/weeklyCalendar';

const Stack = createStackNavigator();

const WorkoutNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WeecklyCal"
        component={WeeklyCal}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Start"
        component={Start}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DailyPlan"
        component={DailyPlan}
        options={({ route }) => ({
          headerLeft: false,
          title: 'My WorkOut',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#3F3B6C',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />

      <Stack.Screen
        name="Details"
        component={Details}
        options={({ route }) => ({
          title: 'Workouts',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#3F3B6C',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />

      <Stack.Screen
        name="SyncData"
        component={SyncData}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default WorkoutNavigator;
