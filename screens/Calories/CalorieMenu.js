import { useNavigation } from '@react-navigation/native';
import { BottomSheet, ListItem } from '@rneui/base';
import { Direct } from 'iconsax-react-native';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { List, Text } from 'react-native-paper';
import { IconArrow, IconArrowLeft } from '../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';

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
      name: i18n.t('report'),
      onPress: () => handleGoToReport(),
      active: true,
    },
    {
      id: 4,
      name: i18n.t('createmeal'),
      onPress: () => setStatus('createMeal'),
      active: false,
    },
    {
      id: 5,
      name: i18n.t('previousMenu'),
      onPress: () => handleHideMenu(),
      active: true,
    },
    {
      id: 6,
      name: i18n.t('backtohome'),
      onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] }),
      active: true,
    },
  ];

  return (
    <BottomSheet
      style={{
        direction: RTL ? 'rtl' : 'ltr',
        position: 'absolute',
        bottom: 10,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2.5,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderTopColor: 'lightgrey',
        borderTopWidth: 1,
        padding: 10,
        marginVertical: 10,
      }}
      modalProps={{}}
      isVisible={status === 'idle'}>
      {menuList.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={styles.containerStyle}
          onPress={l.active ? l.onPress : () => {}}>
          <ListItem.Content
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <ListItem.Title
              style={[
                styles.titleStyle,
                { color: l.active ? theme.colors.secondary : '#ccc' },
                { borderBottomColor: l.active ? '#000' : '#ccc' },
                { borderBottomWidth: l.active ? 1 : 0 },
                { fontFamily: 'Vazirmatn' },
              ]}>
              {l.name}
            </ListItem.Title>
            <ListItem.Subtitle
              style={{
                color: l.active ? theme.colors.secondary : '#ccc',
                fontFamily: 'Vazirmatn',
                fontSize: 10,
              }}>
              {l.active ? '' : i18n.t('notActive')}
            </ListItem.Subtitle>

            {RTL ? (
              <IconArrowLeft
                size={20}
                color={l.active ? theme.colors.secondary : '#ccc'}
              />
            ) : (
              <ListItem.Chevron />
            )}
          </ListItem.Content>
        </ListItem>
      ))}
    </BottomSheet>
  );
}

export default CalorieMenu;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  button: {
    marginHorizontal: 10,
  },
  titleStyle: {
    color: '#000',
    borderBottomColor: '#000',
    borderBottomWidth: 1,
  },
});
