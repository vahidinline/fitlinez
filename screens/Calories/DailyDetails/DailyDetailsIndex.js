import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import AuthContext from '../../../api/context';
import getDailyCaloriesDetails from '../../../api/getDailyCaloriesDetails';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';

function DailyDetailsIndex(mainStatus) {
  console.log('mainStatus in DailyDetailsIndex');
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';
  // Calculate today's and yesterday's dates
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 2); // Use 1 instead of 2 if you want the previous day
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  const [result, setResult] = useState([]);
  const [status, setStatus] = useState('idle');
  const [totalCalories, setTotalCalories] = useState([]);
  console.log('totalCalories in DailyDetailsIndex', totalCalories);
  //console.log('status in DailyDetailsIndex', status);
  useEffect(() => {
    HandleGetData();
  }, [mainStatus]);

  const HandleGetData = async () => {
    try {
      setStatus('loading');
      const res = await getDailyCaloriesDetails(userId, today);
      if (res.length === 0) {
        setStatus('noData');
      } else {
        setResult(res.data);
        setTotalCalories(res.total);
        setStatus('succeeded');
      }
    } catch (err) {
      console.log(err);
      setStatus('failed');
    }
  };

  // Function to group the meals by mealName
  const groupByMealName = (meals) => {
    return meals?.reduce((acc, meal) => {
      (acc[meal.mealName] = acc[meal.mealName] || []).push(meal);
      return acc;
    }, {});
  };

  // Grouped meals
  const groupedMeals = groupByMealName(result);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          {status === 'noData' && (
            <Text style={styles.noData}>{i18n.t('noFoodSubmittedToday')}</Text>
          )}
          {status === 'loading' && <Text>Loading...</Text>}
          {status === 'failed' && <Text>Error loading data</Text>}
          {Object.keys(groupedMeals).map((mealName, i) => (
            <View key={i} style={styles.mealSection}>
              <View>
                <Text style={styles.mealName}>{i18n.t(mealName)}</Text>

                {totalCalories.map((calorie) => {
                  if (calorie?.name === mealName) {
                    return (
                      <Text
                        style={{
                          fontFamily: 'Vazirmatn',
                          fontSize: 10,
                          color: '#fff',
                          textAlign: 'center',
                        }}>
                        {calorie.totalCalories} {i18n.t('kcal')}
                      </Text>
                    );
                  }
                })}
              </View>
              {status === 'succeeded' && (
                <View
                  style={{
                    // backgroundColor: '#333',
                    borderRadius: 10,
                    marginBottom: 10,
                    flexDirection: 'column',
                  }}>
                  {groupedMeals[mealName].map((meal, j) => (
                    <View key={j} style={styles.mealItem}>
                      {meal.foodItems.map((foodItem, k) => (
                        <View key={k} style={styles.foodItemList}>
                          <Text style={styles.foodItem}>
                            {foodItem.food_item}
                          </Text>
                          <Text style={styles.details}>
                            {foodItem.calories.amount}{' '}
                            {i18n.t(foodItem.calories?.unit)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    flex: 1,
  },
  details: {
    fontFamily: 'Vazirmatn',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },

  mealSection: {
    marginBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noData: {
    fontFamily: 'Vazirmatn',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  foodItem: {
    fontFamily: 'Vazirmatn',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  mealName: {
    fontFamily: 'Vazirmatn',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
    width: Dimensions.get('window').width / 4.5,
  },
  mealItem: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  foodItemList: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderRadius: 10,
    marginBottom: 0,
    width: Dimensions.get('window').width / 1.6,
  },
});

export default DailyDetailsIndex;
