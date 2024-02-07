import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ListOfExercises from '../components/newPlan/ListOfExercises';

const Drawer = createDrawerNavigator();

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="ListOfExercises">
        <Drawer.Screen name="ListOfExercises" component={ListOfExercises} />
        {/* Add more screens if needed */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
