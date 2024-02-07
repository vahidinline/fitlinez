import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18nt from '../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import { useFonts } from 'expo-font';
import { ContactStackNavigator, MainStackNavigator } from './AuthNavigator';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeNavigator from './HomeNavigator';
import Settings from '../components/userDetails/settings';
import Support from '../components/userDetails/support';
import { useContext } from 'react';
import CalendarView from '../screens/Calendar';
import { Icon } from '@rneui/themed';
import AppLoading from 'expo-app-loading';
import PlanPlusNavigator from './planPlusNavigator';

const Tab = createBottomTabNavigator();

function PlanPlusTabNavigator() {
  const i18n = new I18n(i18nt);
  const { userLanguage } = useContext(LanguageContext);
  i18n.locale = userLanguage;
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="planPlus"
        component={PlanPlusNavigator}
        options={{
          title: i18n.t('workout'),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default PlanPlusTabNavigator;
