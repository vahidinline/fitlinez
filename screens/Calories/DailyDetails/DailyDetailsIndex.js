import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import AuthContext from '../../../api/context';
import getDailyCaloriesDetails from '../../../api/getDailyCaloriesDetails';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import { useTheme } from '@rneui/themed';

function DailyDetailsIndex(mainStatus, setMainStatus) {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';

  // Calculate today's and yesterday's dates
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1); // Previous day
  const yesterdayISO = yesterday.toISOString().split('T')[0];

  const { theme } = useTheme();
  const styles = getStyles(theme, RTL); // Pass RTL as a parameter

  const [result, setResult] = useState([]);
  const [status, setStatus] = useState('idle');
  const [totalCalories, setTotalCalories] = useState([]);
  const [totalCarbs, setTotalCarbs] = useState([]);
  //console.log('totalCarbs', totalCarbs);
  const [totalProteins, setTotalProteins] = useState([]);
  const [totalFats, setTotalFats] = useState([]);
  const [totalSugars, setTotalSugars] = useState([]);
  const [totalFibers, setTotalFibers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    HandleGetData();
  }, [mainStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await HandleGetData();
      setRefreshing(false);
    }, 2000);
  }, []);

  const HandleGetData = async () => {
    try {
      setStatus('loading');
      const res = await getDailyCaloriesDetails(userId, today);
      console.log('res', res.data);
      if (res.data.length === 0) {
        setStatus('noData');
      } else {
        setResult(res.data);
        // Update to set all nutritional values including fats
        setTotalCalories(
          res.aggregatedNutritionalValues.map((meal) => ({
            name: meal.name,
            totalCalories: meal.totalCalories,
          }))
        );
        setTotalCarbs(
          res.aggregatedNutritionalValues.map((meal) => ({
            name: meal.name,
            totalCarbs: meal.totalCarbs.toFixed(0),
          }))
        );
        setTotalProteins(
          res.aggregatedNutritionalValues.map((meal) => ({
            name: meal.name,
            totalProteins: meal.totalProteins.toFixed(0),
          }))
        );

        setTotalFats(
          res.aggregatedNutritionalValues.map((meal) => ({
            name: meal.name,
            totalFats: meal.totalFat.toFixed(0),
          }))
        );
        setTotalSugars(
          res.aggregatedNutritionalValues.map((meal) => ({
            name: meal.name,
            totalSugars: meal.totalSugars.toFixed(0),
          }))
        );
        setTotalFibers(
          res.aggregatedNutritionalValues.map((meal) => ({
            name: meal.name,
            totalFibers: meal.totalFibers.toFixed(0),
          }))
        );
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
    <SafeAreaView>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent} // Added to set flexGrow
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
              <View style={styles.MealMainSection}>
                <Text style={styles.mealName}>{i18n.t(mealName)}</Text>

                {totalCalories.map((calorie, i) => {
                  if (calorie?.name === mealName) {
                    return (
                      <Text key={i} style={styles.nutritionalValueText}>
                        {calorie.totalCalories} {i18n.t('kcal')}
                      </Text>
                    );
                  }
                })}
                {totalCarbs.map((carbs, i) => {
                  if (carbs?.name === mealName) {
                    return (
                      <Text key={i} style={styles.nutritionalValueText}>
                        {carbs.totalCarbs} {i18n.t('carbs')}
                      </Text>
                    );
                  }
                })}
                {totalProteins.map((protein, i) => {
                  if (protein?.name === mealName) {
                    return (
                      <Text key={i} style={styles.nutritionalValueText}>
                        {protein.totalProteins} {i18n.t('g')}{' '}
                        {i18n.t('protein')}
                      </Text>
                    );
                  }
                })}
                {totalFats.map((fat, i) => {
                  if (fat?.name === mealName) {
                    return (
                      <Text key={i} style={styles.nutritionalValueText}>
                        {fat.totalFats} {i18n.t('g')} {i18n.t('fat')}
                      </Text>
                    );
                  }
                })}
                {totalSugars.map((sugar, i) => {
                  if (sugar?.name === mealName) {
                    return (
                      <Text key={i} style={styles.nutritionalValueText}>
                        {sugar.totalSugars} {i18n.t('g')} {i18n.t('sugar')}
                      </Text>
                    );
                  }
                })}
                {totalFibers.map((fiber, i) => {
                  if (fiber?.name === mealName) {
                    return (
                      <Text key={i} style={styles.nutritionalValueText}>
                        {fiber.totalFibers} {i18n.t('g')} {i18n.t('fiber')}
                      </Text>
                    );
                  }
                })}
              </View>
              {status === 'succeeded' && (
                <View style={styles.mealItemsContainer}>
                  {groupedMeals[mealName].map((meal, j) => (
                    <View key={j} style={styles.mealItem}>
                      {meal.foodItems.map((foodItem, k) => (
                        <View key={k} style={styles.foodItemContainer}>
                          <Text style={styles.foodItem}>
                            {foodItem.food_item}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      flex: 1, // Ensures the container takes up the available space
      marginHorizontal: 10,
      marginBottom: 100,
    },
    scrollView: {
      flexGrow: 1, // Allows the ScrollView to fill its parent container
    },
    scrollViewContent: {
      flexGrow: 1, // Ensures content inside the ScrollView can expand to enable scrolling
    },
    mealSection: {
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#333',
      padding: 10,
      borderRadius: 10,
      direction: RTL ? 'rtl' : 'ltr',
    },
    MealMainSection: {
      borderEndWidth: 1,
      borderColor: '#fff',
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
    noData: {
      fontFamily: 'Vazirmatn',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.warning,
      textAlign: 'center',
    },
    loadingText: {
      fontFamily: 'Vazirmatn',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff',
      textAlign: 'center',
    },
    errorText: {
      fontFamily: 'Vazirmatn',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#fff',
      textAlign: 'center',
    },
    nutritionalValueText: {
      fontFamily: 'Vazirmatn',
      fontSize: 10,
      color: '#fff',
      marginHorizontal: 10,
      textAlign: !RTL ? 'right' : 'left',
    },
    mealItemsContainer: {
      borderRadius: 10,
      marginBottom: 10,
      flexDirection: 'column',
    },
    mealItem: {
      marginBottom: 10,
      paddingLeft: 10,
    },
    foodItemContainer: {
      flexDirection: 'row',
      borderRadius: 10,
      direction: RTL ? 'rtl' : 'ltr',
      width: Dimensions.get('window').width / 1.6,
    },
    foodItem: {
      fontFamily: 'Vazirmatn',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 10,
      marginHorizontal: 10,
      color: '#fff',
      height: 20,
    },
  });

export default DailyDetailsIndex;
