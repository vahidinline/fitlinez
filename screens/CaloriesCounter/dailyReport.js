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
import { IconAdd, IconArrow } from '../marketplace/filters/icons';

function DailyReport({ userId }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [dailyGoalStatus, setDailyGoalStatus] = useState('idle');
  const [result, setResult] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(0);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const percentage =
    (dailyCalories / result[0]?.totalCalories.toFixed(0)) * 100;
  const angle = (percentage / 100) * 360;

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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={styles.box}>
            <Text style={styles.nutrientText}>{i18n.t('protein')} </Text>
            <Text style={styles.errorText}>
              {dailyProtein
                ? convertToPersianNumbers(dailyProtein, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.nutrientText}>{i18n.t('carbs')} </Text>
            <Text style={styles.errorText}>
              {dailyCarbs
                ? convertToPersianNumbers(dailyCarbs, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <View style={styles.box}>
            <Text style={styles.nutrientText}>{i18n.t('fats')} </Text>
            <Text style={styles.errorText}>
              {dailyProtein
                ? convertToPersianNumbers(dailyFat, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.nutrientText}>{i18n.t('fiber')} </Text>
            <Text style={styles.errorText}>
              {dailyFiber
                ? convertToPersianNumbers(dailyFiber, RTL) + ' ' + i18n.t('g')
                : i18n.t('noData')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {dailyGoalStatus == 'noDailyCalories' ? (
        <TouchableOpacity
          onPress={() => {
            navigator.navigate('Calories');
          }}>
          <Text style={styles.errorText}>
            {i18n.t('Nodailycaloriesgoalsset')}{' '}
          </Text>
          <View style={styles.box}>
            <IconAdd color={theme.colors.secondary} size={48} />
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigator.navigate('Calories');
          }}
          style={[styles.container]}>
          {status === 'success' && (
            <View
              style={{
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                // marginVertical: 25,
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
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center',
                        alignSelf: 'center',
                        width: Dimensions.get('window').width / 1.3,
                        padding: 5,
                        height: 50,
                      }}>
                      <View>
                        <Text
                          style={{
                            color: theme.colors.primary,
                            fontSize: 28,
                            textAlign: 'center',
                            fontFamily: 'Vazirmatn',
                            //margin: 5,
                          }}>
                          {convertToPersianNumbers(dailyCalories, RTL)}{' '}
                          {i18n.t('calories')}{' '}
                          <Text
                            style={{
                              color: theme.colors.primary,
                              fontSize: 12,
                              textAlign: 'center',
                              fontFamily: 'Vazirmatn',
                              // margin: 5,
                            }}>
                            {i18n.t('remaining')}
                          </Text>
                        </Text>
                      </View>
                      <View>
                        <IconArrow size={32} color={theme.colors.white} />
                      </View>
                    </View>
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
    </View>
  );
}

export default DailyReport;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      width: Dimensions.get('window').width / 1.1,
      height: Dimensions.get('window').height / 3.5,
      // backgroundColor: theme.colors.warning,
      marginVertical: 5,
    },

    macroItem: {
      borderRadius: 8,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 40,
      alignItems: 'center',
      paddingHorizontal: 4,
      margin: 4,
    },
    box: {
      justifyContent: 'center',
      width: Dimensions.get('window').width / 2.3,
      height: 80,
      alignContent: 'center',
      alignItems: 'center',
      marginVertical: 4,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
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
      //flexDirection: 'row',
      borderColor: theme.colors.grey0,
      width: Dimensions.get('window').width / 1.11,
      borderRadius: 16,
      justifyContent: 'center',
      marginBottom: 40,
      alignItems: 'center',
      borderWidth: 1,
      alignContent: 'center',
      height: 50,
      opacity: 0.5,

      //bottom: 20,
      backgroundColor: theme.colors.grey0,
      // top: 20,
    },
    caloriesText: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn',
      fontSize: 20,
      textAlign: 'center',
      marginBottom: 15,
      zIndex: 1000,
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
      fontSize: 16,
      fontFamily: 'Vazirmatn',
      margin: 5,
    },
    nutrientContainer: {
      width: Dimensions.get('window').width / 1.1,
      height: Dimensions.get('window').height / 8,
      borderRadius: 12,
      //  marginHorizontal: 50,
      justifyContent: 'center',
      // padding: 15,
    },
    nutrientText: {
      direction: RTL ? 'rtl' : 'ltr',
      color: theme.colors.secondary,
      fontSize: 16,
      fontFamily: 'Vazirmatn',
    },
  });
