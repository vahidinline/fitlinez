import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import WelcomeScreen from '../screens/welcome';
import Start from '../screens/start';
import RegisterScreen from '../screens/Register';
import SyncData from '../api/SyncData';
import UpdateProfile from '../components/userDetails/UpdateProfile';
import WeeklyCal from '../screens/weeklyCalendar';
import Neat from '../screens/Neat';
import Rest from '../screens/Rest';
import HomePage from '../screens/Home/HomePage';

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

// const DrawerNavigation = () => {
//   return (
//     <Drawer.Navigator
//       initialRouteName="Statistics"
//       screenOptions={{
//         drawerPosition: 'right',
//         headerLeft: false,
//         headerRight: () => <DrawerToggleButton />,
//       }}>
//       <Drawer.Screen
//         name="Profile"
//         component={Profile}
//         options={{
//           drawerIcon: ({ focused, size }) => (
//             <Icon
//               name="person"
//               size={size}
//               color={focused ? 'orange' : 'black'}
//             />
//           ),
//           headerStyle: {
//             backgroundColor: 'orange',
//           },
//           headerTintColor: 'black',
//           headerLeft: false,
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//               <Icon name="menu" size={30} color="black" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Setting"
//         component={Settings}
//         options={{
//           drawerIcon: ({ focused, size }) => (
//             <Icon
//               name="settings"
//               size={size}
//               color={focused ? 'orange' : 'black'}
//             />
//           ),
//           headerStyle: {
//             backgroundColor: 'orange',
//           },
//           headerTintColor: 'black',
//           headerLeft: false,
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//               <Icon name="menu" size={30} color="black" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       {/* <Drawer.Screen name="Support" component={Support} /> */}
//       {/* <Drawer.Screen name="Review" component={AppReview} /> */}
//       <Drawer.Screen
//         name="Report"
//         options={{
//           drawerIcon: ({ focused, size }) => (
//             <Icon
//               name="report"
//               size={size}
//               color={focused ? 'orange' : 'black'}
//             />
//           ),
//           headerStyle: {
//             backgroundColor: 'orange',
//           },
//           headerTintColor: 'black',
//           headerLeft: false,
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//               <Icon name="menu" size={30} color="black" />
//             </TouchableOpacity>
//           ),
//         }}
//         component={CalendarView}
//       />
//       <Drawer.Screen
//         name="About"
//         component={AboutApp}
//         options={{
//           drawerIcon: ({ focused, size }) => (
//             <Icon
//               name="note"
//               size={size}
//               color={focused ? 'orange' : 'black'}
//             />
//           ),
//           headerStyle: {
//             backgroundColor: 'orange',
//           },
//           headerTintColor: 'black',
//           headerLeft: false,
//           headerRight: () => (
//             <TouchableOpacity
//               onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
//               <Icon name="menu" size={30} color="black" />
//             </TouchableOpacity>
//           ),
//         }}
//       />
//       {/* <Drawer.Screen name="ScannerScreen" component={ScannerScreen} /> */}
//     </Drawer.Navigator>
//   );
// };

const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
          title: 'Home Page',
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
        name="WeeklyCal"
        component={WeeklyCal}
        options={{
          headerShown: true,
          title: 'My WorkOut',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="SyncData"
        component={SyncData}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="Start"
        component={Start}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* <Stack.Screen
        name="RestCounter"
        component={RestCounter}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
};
const ContactStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Drawer"
        component={DrawerNavigation}
        options={{
          headerShown: false,
          title: 'My Profile',
          headerStyle: {
            backgroundColor: '#3F3B6C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="Update" component={UpdateProfile} />
    </Stack.Navigator>
  );
};

// const MessangerNavigator = () => {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Chat"
//         component={ListOfMSG}
//         options={{
//           title: 'Group Messanger',
//           headerStyle: {
//             backgroundColor: '#3F3B6C',
//           },
//           headerTintColor: '#fff',
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       />
//     </Stack.Navigator>
//   );
// };
const ProgressNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="progress"
        component={Progress}
        options={{
          title: 'My Size tracker',
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
        name="Charts"
        component={Charts}
        options={{
          title: 'Charts',
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
        name="Chart"
        component={Chart}
        options={{
          title: 'Charts',
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
export {
  MainStackNavigator,
  ContactStackNavigator,
  // DrawerNavigation,
  ProgressNavigator,
};
