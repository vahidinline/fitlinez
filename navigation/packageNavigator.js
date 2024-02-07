import { createStackNavigator } from '@react-navigation/stack';
import Packages from '../components/packeges';
import PackagePage from '../components/packeges/package';

const Stack = createStackNavigator();

const PackageNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="planPlusIndex"
        component={Packages}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PackagePage"
        component={PackagePage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default PackageNavigator;
