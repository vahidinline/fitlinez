import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18nt from '../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import { useContext } from 'react';
import { useTheme } from '@rneui/themed';
import HomeIndex from '../screens/Home/HomeIndex';
import CustomReport from '../screens/customReport';
import MsgContext from '../api/messageContext';
import SettingNavigator from './settingNavigator';
import ProfileNavigator from './profileNavigator';
import {
  IconCakeFocused,
  IconCakeUnFocused,
  IconHomeFocused,
  IconHomeUnFocused,
  IconProfileFocused,
  IconProfileUnFocused,
  IconSettingsFocused,
  IconSettingsUnFocused,
  IconStatsFocused,
  IconStatsUnFocused,
  IconWeightScale,
} from '../screens/marketplace/filters/icons';
import CaloriesIndex from '../screens/Calories/CaloriesIndex';

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
        tabBarIndicatorStyle: {
          backgroundColor: '#00BB23',
          height: 3,
        },
        tabBarLabelStyle: {
          fontFamily: 'Vazirmatn',
        },
        activeTintColor: theme.colors.white,
        inactiveTintColor: theme.colors.grey2,
        style: {
          backgroundColor: theme.colors.black,
          fontFamily: 'Vazirmatn',
        },
      }}
      activeColor={theme.colors.white}
      inactiveColor={theme.colors.grey0}
      barStyle={{ backgroundColor: 'transparent' }}>
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
        component={CaloriesIndex}
        options={{
          headerShown: false,
          title: i18n.t('calorieCounter'),
          tabBarIcon: ({ focused }) =>
            !focused ? (
              <IconWeightScale fill={'#5B5891'} color={'grey'} />
            ) : (
              <IconWeightScale color={'#5B5891'} fill={'#grey'} />
            ),
        }}
      />
      {/* <Tab.Screen
        swipEnabled={false}
        name="DailyTaskIndex"
        component={DailyTaskIndex}
        options={{
          headerShown: false,
          title: i18n.t('todayTasks'),
          tabBarIcon: ({ focused }) =>
            !focused ? <IconToDoList /> : <IconToDoList color={'#292D32'} />,
        }}
      /> */}
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
    </Tab.Navigator>
  );
}

export default TabNavigator;
