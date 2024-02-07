import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SettingIndex from '../screens/settings/IndexSettings';
import ChangeLanguage from '../screens/settings/changeLanguage';
import SupportIndex from '../screens/settings/supportIndex';
const Stack = createStackNavigator();
function SettingNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingIndex"
        component={SettingIndex}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangeLanguage"
        component={ChangeLanguage}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SupportIndex"
        component={SupportIndex}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default SettingNavigator;
