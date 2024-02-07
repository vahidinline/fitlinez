import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ProfileIndex from '../screens/profile/ProfileIndex';
import IndexOnBoarding from '../screens/onBoarding/IndexOnBoarding';
import UnitSelector from '../screens/profile/unitSelector';
import Aboutme from '../screens/profile/Aboutme';
import Upgrade from '../screens/upgrade';
const Stack = createStackNavigator();
function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileIndex"
        component={ProfileIndex}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="IndexOnBoarding"
        component={IndexOnBoarding}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="UnitSelector"
        component={UnitSelector}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Aboutme"
        component={Aboutme}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Upgrade"
        component={Upgrade}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileNavigator;
