import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { selectMeal } from '../../api/AsyncTempSessionStorage';
import { useTheme } from '@rneui/themed';

import LanguageContext from '../../api/langcontext';
import getDailyCaloriesDetails from '../../api/getDailyCaloriesDetails';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { useNavigation } from '@react-navigation/native';

function MealList() {
  const { theme } = useTheme();
  const navigator = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';

  // Date calculations
  const today = new Date().toISOString().split('T')[0];

  // State management
  const [selectedMeal, setSelectedMealLocal] = useState(null);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleMealSelection = async (meal) => {
    setStatus('loading');
    const res = await selectMeal(meal.value, userId);
    if (res) {
      setSelectedMeal(meal.value);
      setSelectedMealLocal(meal.value);
      setStatus('mealInitialized');
    }
  };

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
    <SafeAreaView style={styles.container}>
      <View style={styles.mealSelectionContainer}>
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigator.navigate('FoodInput', {
                  mealValue: item.value,
                  maealName: item.name,
                })
              }
              style={styles.mealButton}>
              <Text style={styles.mealText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {status === 'noData' && (
          <Text style={styles.noData}>{i18n.t('noFoodSubmittedToday')}</Text>
        )}
        {status === 'loading' && (
          <Text style={styles.loadingText}>{i18n.t('loading')}...</Text>
        )}
        {status === 'failed' && (
          <Text style={styles.errorText}>{i18n.t('errorLoadingData')}</Text>
        )}
        {Object.keys(groupedMeals).map((mealName, i) => (
          <View key={i} style={styles.mealSection}>
            <View style={styles.mealHeader}>
              <Text style={styles.mealName}>{i18n.t(mealName)}</Text>
              {/* Display nutritional info if available */}
              {status === 'succeeded' &&
                groupedMeals[mealName].map((meal, j) => (
                  <View key={j} style={styles.mealDetail}>
                    {meal.foodItems.map((foodItem, k) => (
                      <Text key={k} style={styles.foodItem}>
                        {foodItem.food_item}
                      </Text>
                    ))}
                  </View>
                ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  backgroundColor: '#fff',
  },
  mealSelectionContainer: {
    flex: 1,
    padding: 10,
  },
  mealButton: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  mealText: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
    margin: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
    margin: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    margin: 20,
  },
  mealSection: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealDetail: {
    marginTop: 10,
  },
  foodItem: {
    fontSize: 14,
    color: '#555',
  },
});

export default MealList;
