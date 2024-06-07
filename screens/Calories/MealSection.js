import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { selectMeal } from '../../api/AsyncTempSessionStorage';
import { BottomSheet, Image, ListItem } from '@rneui/base';
import { useTheme } from '@rneui/themed';

function MealSection({ userId, setStatus, setSelectedMeal, i18n, status }) {
  const { theme } = useTheme();
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
    // <BottomSheet
    //   style={{
    //     position: 'absolute',
    //     //  bottom: 10,
    //     width: Dimensions.get('window').width,
    //     height: Dimensions.get('window').height / 2.5,
    //     backgroundColor: '#fff',
    //     borderRadius: 10,
    //     padding: 10,
    //     marginVertical: 10,
    //   }}
    //   modalProps={{}}
    //   // isVisible={status === 'idle'}
    // >
    //   {meals.map((l, i) => (
    //     <ListItem
    //       key={i}
    //       containerStyle={styles.containerStyle}
    //       onPress={l.active ? l.onPress : () => {}}>
    //       <ListItem.Content
    //         style={{
    //           flexDirection: 'row',
    //           justifyContent: 'space-between',
    //         }}>
    //         <ListItem.Title
    //           style={[
    //             styles.titleStyle,
    //             { color: l.active ? '#000' : '#ccc' },
    //             { borderBottomColor: l.active ? '#000' : '#ccc' },
    //             { borderBottomWidth: l.active ? 1 : 0 },
    //           ]}>
    //           {l.name}
    //         </ListItem.Title>
    //         <ListItem.Subtitle style={{ color: l.active ? '#000' : '#ccc' }}>
    //           {l.active ? '' : i18n.t('notActive')}
    //         </ListItem.Subtitle>
    //         <ListItem.Chevron />
    //       </ListItem.Content>
    //     </ListItem>
    //   ))}
    // </BottomSheet>
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
        {i18n.t('insetmealtitle')}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
        {meals.map((meal, index) => (
          <TouchableOpacity
            onPress={() => setMeal(meal.name)}
            style={{
              width: Dimensions.get('window').width / 3,
              height: Dimensions.get('window').width / 3,
              backgroundColor: 'lightgrey',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              margin: 10,
            }}
            key={index}>
            {/* <Image
              source={meal?.img}
              style={{ width: 80, height: 80, margin: 10 }}
              onPress={() => setMeal(meal.name)}
            /> */}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 18,
                color: theme.colors.secondary,
                fontWeight: 'bold',
                margin: 10,
              }}>
              {meal.name}
            </Text>
          </TouchableOpacity>
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
