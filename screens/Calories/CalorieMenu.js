import { useNavigation } from '@react-navigation/native';
import { BottomSheet, ListItem } from '@rneui/base';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

function CalorieMenu({ status, list, userId, setStatus, setSelectedMeal }) {
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
      name: 'Add Food',
      onPress: () => setStatus('addFood'),
    },
    {
      id: 2,
      name: 'Set Daily Calories',
      onPress: () => setStatus('setDailyCalories'),
    },
    {
      id: 3,
      name: 'Report',
      onPress: () => setStatus('report'),
    },
    {
      id: 4,
      name: 'Create Meal',
      onPress: () => setStatus('createMeal'),
    },
    {
      id: 5,
      name: 'Back',
      onPress: () => handleHideMenu(),
    },
  ];

  return (
    <BottomSheet
      style={{
        position: 'absolute',
        bottom: 10,
        width: Dimensions.get('window').width,

        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        // marginHorizontal: 20,
        marginVertical: 10,
      }}
      modalProps={{}}
      isVisible={status === 'idle'}>
      {menuList.map((l, i) => (
        <ListItem
          key={i}
          containerStyle={styles.containerStyle}
          onPress={l.onPress}>
          <ListItem.Content>
            <ListItem.Title style={styles.titleStyle}>{l.name}</ListItem.Title>
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
