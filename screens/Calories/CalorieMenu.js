import { useNavigation } from '@react-navigation/native';
import { BottomSheet, ListItem } from '@rneui/base';
import { Direct, TextalignCenter } from 'iconsax-react-native';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import {
  IconArrow,
  IconArrowDown,
  IconArrowLeft,
  IconArrowUp,
  IconMenu,
} from '../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';
import { t } from 'i18n-js';

function CalorieMenu({
  status,
  list,
  userId,
  setStatus,
  setSelectedMeal,
  i18n,
  RTL,
}) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const handleGoToReport = () => {
    setStatus('CustomReport');
    navigation.navigate('CustomCalorieReport', { userId });
  };

  const handleHideMenu = () => {
    setStatus('idle');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const menuList = [
    {
      id: 1,
      name: i18n.t('addfood'),
      onPress: () => setStatus('addFood'),
      active: true,
    },
    {
      id: 2,
      name: i18n.t('setdailycalories'),
      onPress: () => setStatus('setDailyCalories'),
      active: true,
    },
    {
      id: 3,
      name: i18n.t('seeHistory'),
      onPress: () => handleGoToReport(),
      active: true,
    },
    {
      id: 5,
      name: i18n.t('previousMenu'),
      onPress: () => handleHideMenu(),
      active: true,
    },
  ];

  return (
    <BottomSheet
      containerStyle={styles.bottomSheetContainer}
      modalProps={{}}
      isVisible={status === 'idle'}>
      <TouchableOpacity
        style={styles.touchableOpacity}
        onPress={() => setStatus('seeDetails')}>
        <IconArrowDown color={theme.colors.secondary} size={40} />
      </TouchableOpacity>
      {menuList.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={styles.containerStyle}
          onPress={l.active ? l.onPress : () => {}}>
          <ListItem.Content style={styles.listItemContent}>
            <Text style={[styles.textStyle, { color: theme.colors.text }]}>
              {l.name}
            </Text>
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

export default CalorieMenu;

const styles = StyleSheet.create({
  bottomSheetContainer: {
    position: 'absolute',
    bottom: 40,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderTopColor: 'lightgrey',
    borderTopWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  touchableOpacity: {
    alignItems: 'center',
    height: 40,
  },
  containerStyle: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 5,
    borderBottomColor: 'lightgrey',
  },
  listItemContent: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  textStyle: {
    fontFamily: 'Vazirmatn',
    fontSize: 16,
    textAlign: 'center',
  },
});
