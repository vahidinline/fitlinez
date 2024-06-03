import { useNavigation } from '@react-navigation/native';
import { BottomSheet, ListItem } from '@rneui/base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

function CalorieMenu({
  status,
  list,
  userId,
  setStatus,
  setSelectedMeal,
  i18n,
}) {
  const navigation = useNavigation();

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
      onPress: () => setStatus('CustomReport'),
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
      name: i18n.t('back'),
      onPress: () => handleHideMenu(),
      active: true,
    },
  ];

  return (
    <BottomSheet
      style={{
        position: 'absolute',
        bottom: 10,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2.5,
        backgroundColor: '#fff',
        borderRadius: 10,
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
                { color: l.active ? '#000' : '#ccc' },
                { borderBottomColor: l.active ? '#000' : '#ccc' },
                { borderBottomWidth: l.active ? 1 : 0 },
              ]}>
              {l.name}
            </ListItem.Title>
            <ListItem.Subtitle style={{ color: l.active ? '#000' : '#ccc' }}>
              {l.active ? '' : i18n.t('notActive')}
            </ListItem.Subtitle>
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
