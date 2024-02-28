import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartSessionIndex from '../screens/Sessions/StartSessionIndex';
import WeeklyPlan from '../screens/Sessions/WeeklyPlan';
import SessionMainPage from '../screens/Sessions/SessionMainPage';
import FinishSession from '../screens/Sessions/FinishSession';
import SahreResult from '../screens/Sessions/SahreResult';

const Stack = createStackNavigator();

const SessionNavigator = () => {
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

export default SessionNavigator;
