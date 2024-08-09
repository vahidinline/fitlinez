import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { selectMeal } from '../../api/AsyncTempSessionStorage';
import { useTheme } from '@rneui/themed';

function MealSection({ userId, setStatus, setSelectedMeal, i18n }) {
  const { theme } = useTheme();
  const meals = [
    {
      id: 1,
      name: i18n.t('breakfast'), // i18n.t('breakfast'
      value: 'breakfast',
      color: 'primary',
      img: require('../../assets/icons/breakfast.png'),
    },
    {
      id: 2,
      name: i18n.t('snack'),
      value: 'snack',
      color: 'warning',
      img: require('../../assets/icons/snack.png'),
    },

    {
      id: 3,
      name: i18n.t('lunch'),
      value: 'lunch',
      color: 'success',
      img: require('../../assets/icons/lunch.png'),
    },
    {
      id: 4,
      name: i18n.t('dinner'),
      value: 'dinner',
      color: 'success',
      img: require('../../assets/icons/dinner.png'),
    },
    {
      id: 5,
      name: i18n.t('snack'),
      value: 'snack',
      color: 'warning',
      img: require('../../assets/icons/snack.png'),
    },

    {
      id: 6,
      name: i18n.t('desert'),
      value: 'desert',
      color: 'error',
      img: require('../../assets/icons/dessert.png'),
    },
    {
      id: 7,
      name: i18n.t('drink'),
      value: 'drink',
      color: 'error',
      img: require('../../assets/icons/drink.png'),
    },
  ];

  const [meal, setMeal] = useState(null);
  const handleMealSelection = async (meal) => {
    setStatus('loading');
    const res = await selectMeal(meal, userId);
    if (res) {
      setStatus('mealInitialized');
    }
  };

  useEffect(() => {
    if (meal) {
      // handleMealSelection(meal);
      setStatus('mealInitialized');
      setSelectedMeal(meal);
    }
  }, [meal]);

  return (
    <View
      style={{
        flexDirection: 'column',
        flex: 1,
      }}>
      <View
        style={{
          flexDirection: 'column',

          justifyContent: 'center',
        }}>
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setMeal(meal)}
              style={{
                width: Dimensions.get('window').width / 1.2,
                height: Dimensions.get('window').width / 6,
                backgroundColor: 'lightgrey',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                margin: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: theme.colors.secondary,
                  fontWeight: '500',
                  margin: 14,
                  fontFamily: 'Vazirmatn',
                }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

export default MealSection;

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
    fontFamily: 'Vazirmatn',
  },
});
