import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useContext } from 'react';
import {
  Dimensions,
  Platform,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Icon, Text } from '@rneui/themed';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@rneui/themed';
import { IconArrowLeft } from '../screens/marketplace/filters/icons-';
import LanguageContext from '../api/langcontext';
import { IconArrowRight } from '../screens/marketplace/filters/icons';

function Header({ title, rightIconPress, left }) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const navigation = useNavigation();
  // const routeNamesHistory = useNavigationState((state) =>
  //   state.routes.map((route) => route.name)
  // );
  // const previousRouteName = routeNamesHistory[routeNamesHistory.length - 2]; // Get the second last item
  // const currentRouteName = routeNamesHistory[routeNamesHistory.length - 1]; // Get the last item

  //console.log('currentRouteName', currentRouteName);

  return (
    <View
      style={{
        flexDirection: 'row',
        width: Dimensions.get('window').width / 1,
        height: 50,
        marginTop: Platform.OS === 'ios' ? 30 : 80,
        marginBottom: 10,
        marginHorizontal: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: theme.colors.background,
          width: Dimensions.get('window').width / 1.5,
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            position: 'absolute',
            alignSelf: 'center',
            left: 0,
            right: 20,
            textAlign: 'center',
            fontFamily: 'Vazirmatn',
            color: theme.colors.secondary,
          }}>
          {title}
        </Text>

        <TouchableOpacity
          onPress={() =>
            rightIconPress ? rightIconPress() : navigation.goBack()
          }>
          <IconArrowLeft />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Header;
