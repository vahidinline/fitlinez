import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import videoPage from '../components/Videos/videoPage';
import videoIndex from '../components/Videos';

const Stack = createStackNavigator();

const VideoNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="videoIndex"
        component={videoIndex}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="videoPage"
        component={videoPage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default VideoNavigator;
