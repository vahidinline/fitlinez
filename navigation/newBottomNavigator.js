import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18nt from '../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import { useContext } from 'react';
import { useTheme } from '@rneui/themed';
import HomeIndex from '../screens/Home/HomeIndex';
import CustomReport from '../screens/customReport';
import MsgContext from '../api/messageContext';
import Svg, { Path } from 'react-native-svg';
import MarketPlaceNavigation from './MarketPlaceNavigation';
import SettingNavigator from './settingNavigator';
import ProfileNavigator from './profileNavigator';
import {
  IconHomeFocused,
  IconHomeUnFocused,
  IconMarketFocused,
  IconMarketUnFocused,
  IconProfileFocused,
  IconProfileUnFocused,
  IconSettingsFocused,
  IconSettingsUnFocused,
  IconStatsFocused,
  IconStatsUnFocused,
} from '../screens/marketplace/filters/icons-';
import StatisticsIndex from '../screens/customReport/statistics';
import ReportIndex from '../screens/Report/ReportIndex';
import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';
import CaloriesIndex from '../screens/Calories/CaloriesIndex';
import {
  IconCakeFocused,
  IconCakeUnFocused,
} from '../screens/marketplace/filters/icons';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { theme } = useTheme();
  const i18n = new I18n(i18nt);
  const { userLanguage } = useContext(LanguageContext);
  const { msg } = useContext(MsgContext);

  i18n.locale = userLanguage;
  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        //linderGradient
        backgroundColor: {
          flex: 1,
          backgroundColor: theme.colors.black,
        },
        activeTintColor: theme.colors.white,
        inactiveTintColor: theme.colors.grey2,
        style: {
          backgroundColor: theme.colors.black,
        },
      }}
      activeColor={theme.colors.white}
      inactiveColor={theme.colors.grey0}
      barStyle={{ backgroundColor: 'transparent' }}>
      <Tab.Screen
        swipEnabled={false}
        name="Settings"
        component={SettingNavigator}
        options={{
          headerShown: false,
          title: i18n.t('settings'),
          tabBarIcon: ({ focused }) =>
            focused ? <IconSettingsFocused /> : <IconSettingsUnFocused />,
        }}
      />

      <Tab.Screen
        swipEnabled={false}
        name="CustomReport"
        component={CustomReport}
        options={{
          headerShown: false,
          title: i18n.t('CalendarView'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconStatsUnFocused /> : <IconStatsFocused />,
        }}
      />
      {/* <Tab.Screen
        swipEnabled={false}
        name="CustomReport"
        component={ReportIndex}
        options={{
          headerShown: false,
          title: i18n.t('CalendarView'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconStatsUnFocused /> : <IconStatsFocused />,
        }}
      /> */}
      <Tab.Screen
        name="HomePage"
        component={HomeIndex}
        options={{
          headerShown: false,
          title: i18n.t('home'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconHomeFocused /> : <IconHomeUnFocused />,
        }}
      />

      {/* <Tab.Screen
        swipEnabled={false}
        name="Calories"
        component={CaloriesIndex}
        options={{
          headerShown: false,
          title: i18n.t('calorieCounter'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconCakeUnFocused /> : <IconCakeFocused />,
        }}
      /> */}
      <Tab.Screen
        swipEnabled={false}
        name="MarketPlace"
        component={MarketPlaceNavigation}
        options={{
          headerShown: false,
          title: i18n.t('plans'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconMarketUnFocused /> : <IconMarketFocused />,
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
          tabBarIcon: ({ focused }) =>
            !focused ? <IconProfileUnFocused /> : <IconProfileFocused />,
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
