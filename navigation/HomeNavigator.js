import { createStackNavigator } from '@react-navigation/stack';
import WalkThrough from '../components/walkThrough';
import TabNavigator from './newBottomNavigator';
import { ContactStackNavigator } from './AuthNavigator';
import TrainersNavigator from './TrainersNavigation';
import GetUserData from '../components/userData';
import Evaluate from '../components/userData/testComponent/evaluate';
import TestExercise from '../components/userData/testComponent/exercises';
import CustomReport from '../screens/customReport';
import MessageCenter from '../screens/message';
import WorkoutListIndex from '../screens/marketplace/ListOfworkouts/WorkoutListIndex';
import IndexOnBoarding from '../screens/onBoarding/IndexOnBoarding';
import PlanItem from '../screens/marketplace/ListOfworkouts/PlanItem';
import LastPageOnboarding from '../screens/onBoarding/LastPage';
import Upgrade from '../screens/upgrade';
import ConfirmPayment from '../screens/upgrade/payment';
import PlanDetailsIndex from '../screens/planDetails/planDetailsIndex';
import SessionNavigator from './SessionNavigator';
import CaloriesIndex from '../screens/Calories/CaloriesIndex';
import CustomCalorieReport from '../screens/Calories/customReport';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={{
          headerShown: false,
          title: 'My WorkOut',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarVisible: true, // Hide the tab bar for this screen
        }}
      />

      <Stack.Screen
        name="SessionNavigator"
        component={SessionNavigator}
        options={{
          headerShown: false,
          gestureEnabled: false,
          title: 'HPage',
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
        name="WorkoutListIndex"
        component={WorkoutListIndex}
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
        name="Calories"
        component={CaloriesIndex}
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
        name="PlanDetailsIndex"
        component={PlanDetailsIndex}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="TrainersNavigator"
        component={TrainersNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="WalkThrough"
        component={WalkThrough}
        options={{
          headerShown: false,
          title: 'Walk hrough',
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
        name="GetUserData"
        component={GetUserData}
        options={{
          headerShown: false,
          title: 'GetUserData',
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
        name="Evaluate"
        component={Evaluate}
        options={{
          headerShown: false,
          title: 'Evaluate',
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
        name="CustomCalorieReport"
        component={CustomCalorieReport}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="profile"
        component={ContactStackNavigator}
        options={{
          headerShown: false,
        }}
      />

      {/* <Stack.Screen
        name="SelectWorkOut"
        component={customPlanNavigator}
        options={({ route }) => ({
          headerShown: true,
          headerLeft: false,
          title: 'SelectWorkOut',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      /> */}
      <Stack.Screen
        name="Upgrade"
        component={Upgrade}
        options={({ route }) => ({
          headerShown: false,
          headerLeft: false,
          title: 'SelectWorkOut',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />

      <Stack.Screen
        name="ConfirmPayment"
        component={ConfirmPayment}
        options={({ route }) => ({
          headerShown: false,
          headerLeft: false,
          title: 'Confirm Payment',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />
      <Stack.Screen
        name="TestExercise"
        component={TestExercise}
        options={({ route }) => ({
          headerShown: false,
          headerLeft: false,
          title: 'SelectWorkOut',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />

      <Stack.Screen
        name="CustomReport"
        component={CustomReport}
        options={({ route }) => ({
          headerShown: false,
          headerLeft: false,
          title: 'CustomReport',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      />
      {/* <Stack.Screen
        name="PlanItem"
        component={PlanItem}
        options={{
          headerShown: false,
        }}
      /> */}

      <Stack.Screen
        name="LastPageOnboarding"
        options={{
          headerShown: false,
        }}
        component={LastPageOnboarding}
      />
      <Stack.Screen name="MessageCenter" component={MessageCenter} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;
