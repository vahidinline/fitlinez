import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CustomCalorieReport from '../screens/CaloriesCounter/customReport';
import SetDailyCalories from '../screens/CaloriesCounter/config/SetDailyCalories';
import FoodItemCard from '../screens/CaloriesCounter/FoodItemTempCard';
import CaloriesIndex from '../screens/CaloriesCounter/CaloriesIndex';
import InputSelector from '../screens/CaloriesCounter/foodInput/InputSelector';

const Stack = createStackNavigator();
function CaloriesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CaloriesIndex"
        component={CaloriesIndex}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CalorieCustomReport"
        component={CustomCalorieReport}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SetDailyCalories"
        component={SetDailyCalories}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FoodInput"
        component={InputSelector}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="FoodItemCard"
        component={FoodItemCard}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default CaloriesNavigator;
