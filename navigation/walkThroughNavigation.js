import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WalkThrough from '../components/walkThrough';

const Stack = createStackNavigator();

const WalkthroughNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="WalkThrough"
        component={WalkThrough}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default WalkthroughNavigator;
