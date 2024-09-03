import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getDailyCalorieInTake } from '../../api/dailyCalorieInTake';
import { useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import convertToPersianNumbers from '../../api/PersianNumber';
import { useNavigation } from '@react-navigation/native';

function DailyReport({ userId }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [dailyGoalStatus, setDailyGoalStatus] = useState('idle');
  const [result, setResult] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyCarbs, setDailyCarbs] = useState(0);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [dailyFat, setDailyFat] = useState(0);
  const [dailyFiber, setDailyFiber] = useState(0);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const percentage =
    (dailyCalories / result[0]?.totalCalories.toFixed(0)) * 100;
  const angle = (percentage / 100) * 360;
  //console.log('dailyCalories in angle', angle);
  // console.log('dailyCalories in daily', dailyCalories);
  //console.log('result in daily', result);
  //console.log('percentage in daily', percentage);
  const getDailyReport = async () => {
    setStatus('loading');
    if (!userId) {
      setStatus('error');
      return;
    }
    const res = await getDailyCalorieInTake(userId);

    if (!res) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setResult(res);
  };

  useEffect(() => {
    getDailyReport();
  }, [userId]);

  const handleAddFoodbutton = () => {};
  const navigator = useNavigation();
  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      const dailyCaloriesGoals = await AsyncStorage.getItem(
        'dailyCaloriesGoals'
      );

      if (dailyCaloriesGoals) {
        setDailyGoalStatus('success');
        const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
        setDailyCalories(Number(parsedDailyCaloriesGoals.dailyCalories));
      }
      if (!dailyCaloriesGoals || dailyCaloriesGoals === null) {
        setDailyGoalStatus('noDailyCalories');
      }
    };

    getDailyCaloriesGoals();
  }, []);

  const NutritionDataSection = ({
    dailyCarbs,
    dailyProtein,
    dailyFat,
    dailyFiber,
  }) => {
    return (
      <View style={styles.nutrientContainer}>
        <View style={styles.row}>
          <Text style={styles.nutrientText}>
            {i18n.t('carbs')} :{' '}
            <Text style={styles.errorText}>
              {dailyCarbs
                ? convertToPersianNumbers(dailyCarbs, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </Text>

          <Text style={styles.nutrientText}>
            {i18n.t('protein')} :{' '}
            <Text style={styles.errorText}>
              {dailyProtein
                ? convertToPersianNumbers(dailyProtein, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.nutrientText}>
            {i18n.t('fats')} :{' '}
            <Text style={styles.errorText}>
              {dailyProtein
                ? convertToPersianNumbers(dailyFat, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </Text>

          <Text style={styles.nutrientText}>
            {i18n.t('fiber')} :{' '}
            <Text style={styles.errorText}>
              {dailyFiber
                ? convertToPersianNumbers(dailyFiber, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View
        style={{
          borderBottomColor: 'grey',
          paddingBottom: 5,
          borderBottomWidth: 1,
          paddingHorizontal: 10,
          marginTop: 10,
        }}>
        <Text
          style={{
            color: theme.colors.primary,
            fontSize: 14,
            // top: 10,
            fontWeight: '400',
            marginHorizontal: 15,

            // marginVertical: 5,
            // color: theme.colors.primary,
            fontFamily: 'Vazirmatn',
            textAlign: 'center',
          }}>
          {i18n.t('calorieCounter')}
        </Text>
      </View>
      {dailyGoalStatus == 'noDailyCalories' ? (
        <TouchableOpacity
          onPress={() => {
            navigator.navigate('Calories');
          }}
          style={styles.container}>
          <Text style={styles.errorText}>
            {i18n.t('Nodailycaloriesgoalsset')}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigator.navigate('Calories');
          }}
          style={[styles.container, { direction: RTL ? 'rtl' : 'ltr' }]}>
          {status === 'success' && (
            <View
              style={{
                marginBottom: 15,
              }}>
              <View style={styles.baseContainer}>
                <Text style={styles.caloriesText}>
                  {result.length > 0 ? (
                    <Text style={styles.kcalText}>
                      {convertToPersianNumbers(
                        dailyCalories - result[0]?.totalCalories.toFixed(0),
                        RTL
                      )}{' '}
                      {i18n.t('calories')}{' '}
                      {dailyGoalStatus === 'success' && (
                        <>
                          <Text style={styles.remainingText}>
                            {i18n.t('of')} {i18n.t('todayscalorie')}{' '}
                            {i18n.t('remaining')}
                          </Text>
                        </>
                      )}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontSize: 16,
                        textAlign: 'center',
                        fontFamily: 'Vazirmatn',
                        margin: 5,
                      }}>
                      {convertToPersianNumbers(dailyCalories, RTL)}{' '}
                      {i18n.t('calories')} {i18n.t('remaining')}
                    </Text>
                  )}
                </Text>
              </View>
              {result.length > 0 ? (
                <NutritionDataSection
                  dailyCarbs={result[0]?.totalCarbs.toFixed(0)}
                  dailyProtein={result[0]?.totalProtein.toFixed(0)}
                  dailyFat={result[0]?.totalFat.toFixed(0)}
                  dailyFiber={result[0]?.totalFiber.toFixed(0)}
                />
              ) : (
                <NutritionDataSection />
              )}
            </View>
          )}
        </TouchableOpacity>
      )}
    </>
  );
}

export default DailyReport;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      flex: 1,
      //backgroundColor: '#5B5891',
      justifyContent: 'center',
      alignItems: 'center',
      //marginHorizontal: 20,
      //flexDirection: 'row',
      //padding: 30,
      borderRadius: 14,
      width: Dimensions.get('window').width / 1.1,
      marginVertical: 10,
      // minHeight: Dimensions.get('window').height / 5,
      flex: 1,

      //marginHorizontal: 10,
      //padding: 10,
      borderRadius: 10,
      //backgroundColor: theme.colors.secondary,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      // width: Dimensions.get('window').width / 2,
    },
    macroItem: {
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      //backgroundColor: theme.colors.background,
      //width: Dimensions.get('window').width / 2.3,
      height: 40,
      alignItems: 'center',
      paddingHorizontal: 4,
      margin: 4,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 14,
    },
    noDataText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
    },
    baseContainer: {
      flexDirection: 'row',
      borderColor: theme.colors.grey0,
      borderRadius: 75,
      height: 60,
      borderOpacity: 0.2,
      justifyContent: 'center',
    },
    caloriesText: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn',
      fontSize: 20,
      textAlign: 'center',
      marginTop: 15,
    },
    kcalText: {
      color: theme.colors.primary,
      fontSize: 20,
      fontFamily: 'Vazirmatn',
    },
    remainingText: {
      color: theme.colors.primary,
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
      flexWrap: 'wrap',
      margin: 5,
    },
    errorText: {
      color: theme.colors.warning,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
      margin: 5,
    },
    nutrientContainer: {
      //width: '99%',
      width: Dimensions.get('window').width / 1.2,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      height: 80,
      marginHorizontal: 15,
      //justifyContent: 'center',
      //alignItems: 'center',
      padding: 15,
    },
    nutrientText: {
      direction: RTL ? 'rtl' : 'ltr',
      color: theme.colors.secondary,
      fontSize: 14,
      fontFamily: 'Vazirmatn',
    },
  });
