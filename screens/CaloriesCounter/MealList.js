import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '@rneui/themed';
import { IconAdd } from '../marketplace/filters/icons';
import LanguageContext from '../../api/langcontext';
import getDailyCaloriesDetails from '../../api/getDailyCaloriesDetails';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../api/context';

function MealList({ userId }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigator = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';
  const { userAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;

  // Date calculations
  const today = new Date().toISOString().split('T')[0];

  // State management
  const [selectedMeal, setSelectedMealLocal] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  console.log('result', result);
  const meals = [
    {
      id: 1,
      name: i18n.t('breakfast'),
      value: 'breakfast',
      color: 'primary',
      img: require('../../assets/icons/breakfast.png'),
    },
    {
      id: 2,
      name: i18n.t('snack'),
      value: 'snack1',
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
      value: 'snack2',
      color: 'warning',
      img: require('../../assets/icons/snack.png'),
    },
    {
      id: 6,
      name: i18n.t('dessert'),
      value: 'dessert',
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

  useEffect(() => {
    if (selectedMeal) {
      fetchData();
    }
  }, [selectedMeal]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await fetchData();
      setRefreshing(false);
    }, 2000);
  }, [selectedMeal]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getDailyCaloriesDetails(userId, today);
      if (res.data.length === 0) {
        setStatus('noData');
      } else {
        setResult(res.data);
        setStatus('succeeded');
      }
    } catch (err) {
      console.error(err);
      setStatus('failed');
    }
  };

  const groupByMealName = (meals) => {
    return meals.reduce((acc, meal) => {
      (acc[meal.mealName] = acc[meal.mealName] || []).push(meal);
      return acc;
    }, {});
  };

  const groupedMeals = groupByMealName(result);

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        ListHeaderComponent={
          <View
            style={{
              borderBottomColor: theme.colors.border,
              //  borderBottomWidth: 1,
            }}>
            {status === 'noData' && (
              <Text style={styles.noData}>
                {i18n.t('noFoodSubmittedToday')}
              </Text>
            )}
            {status === 'loading' && (
              <Text style={styles.loadingText}>{i18n.t('loading')}...</Text>
            )}
            {status === 'failed' && (
              <Text style={styles.errorText}>{i18n.t('errorLoadingData')}</Text>
            )}
          </View>
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mealSection}>
            <TouchableOpacity
              onPress={() =>
                userLevel === 4
                  ? navigator.navigate('FoodInput', {
                      mealValue: item.value,
                      mealName: item.name,
                    })
                  : alert(i18n.t('PremiumAlert'))
              }
              style={styles.mealButton}>
              <Text style={styles.mealText}>{item.name}</Text>
              <IconAdd />
            </TouchableOpacity>

            {/* Display food items under the meal name */}
            {groupedMeals[item.value] &&
              groupedMeals[item.value].map((meal, j) => (
                <View key={j} style={styles.mealDetail}>
                  {meal.foodItems.map((foodItem, k) => (
                    <Text key={k} style={styles.foodItem}>
                      {foodItem.food_item}
                    </Text>
                  ))}
                </View>
              ))}
          </View>
        )}
      />
    </View>
  );
}

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //  backgroundColor: '#fff',
    },
    mealSelectionContainer: {
      flex: 1,
      padding: 10,
    },
    mealButton: {
      margin: 5,
      padding: 5,
      //borderRadius: 10,
      backgroundColor: theme.colors.background,
      //width: Dimensions.get('window').width / 4.5,
      height: Dimensions.get('window').height / 20,
      alignItems: 'center',
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      fontFamily: 'Vazirmatn',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mealText: {
      fontSize: 14,
      color: '#333',
      fontFamily: 'Vazirmatn',
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      padding: 10,
      backgroundColor: theme.colors.background,
    },
    noData: {
      textAlign: 'center',
      fontSize: 16,
      color: 'grey',
      margin: 20,
      fontFamily: 'Vazirmatn',
    },
    loadingText: {
      textAlign: 'center',
      fontSize: 16,
      color: 'grey',
      margin: 20,
      fontFamily: 'Vazirmatn',
    },
    errorText: {
      textAlign: 'center',
      fontSize: 16,
      color: 'red',
      margin: 20,
      fontFamily: 'Vazirmatn',
    },
    mealSection: {
      flexDirection: 'column',
      marginVertical: 10,
      marginHorizontal: 20,
      padding: 10,
      backgroundColor: theme.colors.background,
      borderRadius: 10,
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    mealName: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    mealDetail: {
      marginTop: 10,
      // width: Dimensions.get('window').width / 2,
      // flexWrap: 'wrap',
      // flexDirection: 'column',
    },
    foodItem: {
      fontSize: 14,
      color: '#555',
      flexWrap: 'wrap',
      width: Dimensions.get('window').width / 1.5,
      fontFamily: 'Vazirmatn',
    },
  });

export default MealList;
