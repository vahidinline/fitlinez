import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { selectMeal } from '../../api/AsyncTempSessionStorage';
import { Image } from '@rneui/base';

function MealSection({ userId, setStatus, setSelectedMeal, i18n }) {
  const meals = [
    {
      name: i18n.t('breakfast'), // i18n.t('breakfast'
      color: 'primary',
      img: require('../../assets/icons/breakfast.png'),
    },
    {
      name: i18n.t('lunch'),
      color: 'success',
      img: require('../../assets/icons/lunch.png'),
    },
    {
      name: i18n.t('dinner'),
      color: 'success',
      img: require('../../assets/icons/dinner.png'),
    },
    {
      name: i18n.t('snack'),
      color: 'warning',
      img: require('../../assets/icons/snack.png'),
    },

    {
      name: i18n.t('desert'),
      color: 'error',
      img: require('../../assets/icons/dessert.png'),
    },
    {
      name: i18n.t('drink'),
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
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 20,
          //fontWeight: 'bold',
          color: 'white',
          margin: 20,
          marginBottom: 40,
        }}>
        {i18n.t('enteryourfood')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {meals.map((meal, index) => (
          <View key={index}>
            <Image
              source={meal?.img}
              style={{ width: 80, height: 80, margin: 10 }}
              onPress={() => setMeal(meal.name)}
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 14,
                color: 'white',
                margin: 10,
              }}>
              {meal.name}
            </Text>
          </View>
          // <Button
          //   onPress={() => setMeal(meal.name)}
          //   title={meal.name}
          //   key={index}
          //   buttonStyle={{
          //     margin: 10,
          //     padding: 10,
          //     fontSize: 14,

          //     fontWeight: 'bold',
          //     width: 90,
          //     height: 40,
          //     // borderRadius: 45,
          //     textAlign: 'center',
          //     // backgroundColor: 'lightgrey',
          //   }}
          // />
        ))}
      </View>
    </View>
  );
}

export default MealSection;
