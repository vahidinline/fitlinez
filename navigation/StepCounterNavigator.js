import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import StepCounterMain from '../screens/StepCounter/Index';

const Stack = createStackNavigator();
function StepCounterNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StepCounterMain"
        component={StepCounterMain}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default StepCounterNavigator;
