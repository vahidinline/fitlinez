import React from 'react';
import WorkoutListIndex from '../screens/marketplace/ListOfworkouts/WorkoutListIndex';
import MarketPlaceIndex from '../screens/marketplace/MarketPlaceIndex';
import { createStackNavigator } from '@react-navigation/stack';
import PlanItem from '../screens/marketplace/ListOfworkouts/PlanItem';
import IndexLeaderBoard from '../screens/leaderBoard/IndexLeaderBoard';
import SingleTrainer from '../screens/Trainers/SingleTrainer';
const Stack = createStackNavigator();

function MarketPlaceNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MarketPlaceIndex"
        component={MarketPlaceIndex}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="WorkoutListIndex"
        component={WorkoutListIndex}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PlanItem"
        component={PlanItem}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="trainer"
        component={SingleTrainer}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default MarketPlaceNavigation;
