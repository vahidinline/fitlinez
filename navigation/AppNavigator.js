import React, { useContext, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MainStackNavigator,
  ContactStackNavigator,
  ProgressNavigator,
} from './AuthNavigator';
import HomePage from '../screens/HomePage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CalendarView from '../screens/Calendar';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import videoIndex from '../components/Videos';
import i18nt from '../locales';
import LanguageContext from '../api/langcontext';
import { useFonts } from 'expo-font';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const i18n = new I18n({
    en: {
      home: ' Home',
      todolist: 'Todo List',
      workouts: 'Workouts',
      profile: 'Profile',
      progress: 'Progress',
    },
    fa: {
      home: ' صفحه اصلی',
      todolist: 'گزارش تمرینها',
      workouts: ' تمرینها',
      profile: 'پروفایل',
      progress: 'پیشرفت',
    },
  });
  const { userLanguage } = useContext(LanguageContext);
  i18n.locale = userLanguage;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeBackgroundColor: '#3F3B6C',
        activeTintColor: '#fff',
        inactiveBackgroundColor: '#eee',
        color: '#fff',
      }}>
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          headerShown: false,
          title: i18n.t('home'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={CalendarView}
        options={{
          title: i18n.t('todolist'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={MainStackNavigator}
        options={{
          title: i18n.t('workouts'),

          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        swipEnabled={false}
        name="Contact"
        component={ContactStackNavigator}
        options={{
          title: i18n.t('profile'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressNavigator}
        options={{
          title: i18n.t('progress'),
          title: i18n.t('progress'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Videos"
        component={videoIndex}
        options={{
          title: 'Videos',
          //tabBarVisible: false,
          headerShown: true,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
