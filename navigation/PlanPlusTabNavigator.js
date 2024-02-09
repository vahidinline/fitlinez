import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import i18nt from '../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
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
