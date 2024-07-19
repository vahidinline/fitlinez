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
import RoundAnimationChart from '../../components/RoundAnimationChart';
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
        setDailyCarbs(Number(parsedDailyCaloriesGoals.dailyCarbs));
        setDailyProtein(Number(parsedDailyCaloriesGoals.dailyProtein));
        setDailyFat(Number(parsedDailyCaloriesGoals.dailyFat));
        setDailyFiber(Number(parsedDailyCaloriesGoals.dailyFiber));
      }
      if (!dailyCaloriesGoals || dailyCaloriesGoals === null) {
        setDailyGoalStatus('noDailyCalories');
      }
    };

    getDailyCaloriesGoals();
  }, []);

  return (
    <>
      {dailyGoalStatus == 'noDailyCalories' && (
        <Text style={styles.errorText}>
          {i18n.t('Nodailycaloriesgoalsset')}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => {
          navigator.navigate('Calories');
        }}
        style={[styles.container, { direction: RTL ? 'rtl' : 'ltr' }]}>
        {status === 'success' && (
          <>
            <View style={styles.baseContainer}>
              {/* <RoundAnimationChart
                borderColor="blue" // Custom border color
                borderWidth={2}
                size={200}
                i18n={i18n}
                shownumber={
                  result.length > 0
                    ? convertToPersianNumbers(
                        dailyCalories - result[0]?.totalCalories.toFixed(0),
                        RTL
                      )
                    : convertToPersianNumbers(dailyCalories, RTL)
                }
                takenCalories={
                  dailyCalories - result[0]?.totalCalories.toFixed(0)
                }
                dailyGoal={dailyCalories}
              /> */}
              <Text style={styles.caloriesText}>
                {result.length > 0
                  ? convertToPersianNumbers(
                      dailyCalories - result[0]?.totalCalories.toFixed(0),
                      RTL
                    )
                  : convertToPersianNumbers(dailyCalories, RTL)}
              </Text>
              <Text style={styles.kcalText}>{i18n.t('kcal')}</Text>
              {dailyGoalStatus === 'success' && (
                <>
                  <Text style={styles.remainingText}>
                    {i18n.t('remaining')}
                  </Text>
                </>
              )}
            </View>

            {result.length != 0 && (
              <View style={styles.nutrientContainer}>
                <Text style={styles.nutrientText}>
                  {i18n.t('carbs')}:{' '}
                  {result &&
                    convertToPersianNumbers(
                      result[0]?.totalCarbs.toFixed(0),
                      RTL
                    )}{' '}
                  {i18n.t('g')}
                </Text>
                <Text style={styles.nutrientText}>
                  {i18n.t('protein')}:{' '}
                  {result &&
                    convertToPersianNumbers(
                      result[0]?.totalProtein.toFixed(0),
                      RTL
                    )}{' '}
                  {i18n.t('g')}
                </Text>

                <Text style={styles.nutrientText}>
                  {i18n.t('fats')}:{' '}
                  {result &&
                    convertToPersianNumbers(
                      result[0]?.totalFat.toFixed(0),
                      RTL
                    )}{' '}
                  {i18n.t('g')}
                </Text>
                <Text style={styles.nutrientText}>
                  {i18n.t('fiber')}:{' '}
                  {result &&
                    convertToPersianNumbers(
                      result[0]?.totalFiber.toFixed(0),
                      RTL
                    )}{' '}
                  {i18n.t('g')}
                </Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    </>
  );
}

export default DailyReport;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
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
      justifyContent: 'space-between',
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
      borderWidth: 5,
      borderColor: theme.colors.grey0,
      borderRadius: 75,
      width: 150,
      height: 150,
      //margin: 5,
      borderOpacity: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    caloriesText: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn',
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: 10,
    },
    kcalText: {
      color: theme.colors.primary,
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
    },
    remainingText: {
      color: theme.colors.primary,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
      //fontWeight: 'bold',
      margin: 10,
    },
    errorText: {
      color: theme.colors.warning,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
      //fontWeight: 'bold',
      margin: 10,
    },
    nutrientContainer: {
      alignItems: 'right',
    },
    nutrientText: {
      direction: RTL ? 'rtl' : 'ltr',
      color: theme.colors.primary,
      fontSize: 14,
      // textAlign: 'center',
      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
      margin: 5,
    },
  });
