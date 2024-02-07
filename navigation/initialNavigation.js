import LoginScreen from '../screens/Login';
import LoginIndex from '../screens/Login/LoginIndex';
import SignUpIndex from '../screens/Login/SignUpIndex';
import RegisterScreen from '../screens/Register';
import ForgotPassIndex from '../screens/forgotPassword/ForgotPassIndex';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

const InitialNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginIndex}
        options={{
          headerShown: false,
          title: 'Login',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Stack.Screen
        name="Register"
        component={SignUpIndex}
        options={{
          title: 'Register',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Stack.Screen
        name="ForgotPassIndex"
        component={ForgotPassIndex}
        options={{
          title: 'Forgot Password',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default InitialNavigation;
