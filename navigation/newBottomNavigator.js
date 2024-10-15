import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18nt from '../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import { useContext } from 'react';
import { Text, useTheme } from '@rneui/themed';
import HomeIndex from '../screens/Home/HomeIndex';
import SettingNavigator from './settingNavigator';
import ProfileNavigator from './profileNavigator';

import {
  IconHomeFocused,
  IconHomeUnFocused,
  IconProfileFocused,
  IconProfileUnFocused,
  IconSettingsFocused,
  IconSettingsUnFocused,
  IconWeight,
  IconWeightScale,
} from '../screens/marketplace/filters/icons';
import CaloriesNavigator from './CaloriesNavigator';
import SessionNavigator from './SessionNavigator';
import { SessionContext } from '../api/sessionContext';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useTheme();
  const i18n = new I18n(i18nt);
  const { userLanguage } = useContext(LanguageContext);
  const { sessionData, setSessionData } = useContext(SessionContext);

  i18n.locale = userLanguage;
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        tabBarStyle: {
          // height: 90,

          borderRadius: 20,
        },
        tabBarActiveBackgroundColor: theme.colors.background,
        tabBarInactiveBackgroundColor: theme.colors.disabled,
        tabBarLabelStyle: {
          fontFamily: 'Vazirmatn',
          color: theme.colors.secondary,
        },
      }}
      activeColor={theme.colors.white}
      inactiveColor={theme.colors.grey0}>
      <Tab.Screen
        name="HomePage"
        component={HomeIndex}
        options={{
          headerShown: false,
          title: i18n.t('home'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconHomeUnFocused /> : <IconHomeFocused />,
        }}
      />

      <Tab.Screen
        swipEnabled={false}
        name="Calories"
        component={CaloriesNavigator}
        options={{
          headerShown: false,
          title: i18n.t('calorieCounter'),
          tabBarIcon: ({ focused }) =>
            !focused ? (
              <IconWeightScale fill={'#5B5891'} color={'grey'} />
            ) : (
              <IconWeightScale color={'#5B5891'} fill={'grey'} />
            ),
        }}
      />
      <Tab.Screen
        swipEnabled={false}
        name="SessionNavigator"
        component={SessionNavigator}
        options={{
          headerShown: false,
          tabBarBadge: sessionData.length !== 0 && `*`,
          tabBarBadgeStyle: {
            backgroundColor: 'transparent',
            color: theme.colors.error,
            fontSize: 20,
          },
          title: i18n.t('todaysWorkout'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconWeight /> : <IconWeight fill={'#5B5891'} />,
        }}
      />
      <Tab.Screen
        swipEnabled={false}
        name="profileNavigator"
        component={ProfileNavigator}
        options={{
          //gradientbackground
          headerShown: false,
          title: i18n.t('profile'),
          style: {
            fontFamily: 'Vazirmatn',
          },
          tabBarIcon: ({ focused }) =>
            !focused ? <IconProfileUnFocused /> : <IconProfileFocused />,
        }}
      />
      <Tab.Screen
        swipEnabled={false}
        style={{ fontFamily: 'Vazirmatn' }}
        name="Settings"
        component={SettingNavigator}
        options={{
          headerShown: false,
          title: i18n.t('settings'),
          tabBarIcon: ({ focused }) =>
            focused ? <IconSettingsFocused /> : <IconSettingsUnFocused />,
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
