import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import convertToPersianNumbers from '../../../api/PersianNumber';

function ListReport({ report, i18n, userLanguage }) {
  const [dailygoal, setDailygoal] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const RTL = userLanguage === 'fa';
  // useEffect(() => {
  //   if (!report || typeof report !== 'object' || !report.report) {
  //     console.log('Invalid or missing report data', report);
  //     setStatus('error');
  //     setError('Invalid or missing report data');
  //   } else {
  //     setStatus('success');
  //   }
  // }, [report]);

  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      setIsLoading(true);
      try {
        const dailyCaloriesGoals = await AsyncStorage.getItem(
          'dailyCaloriesGoals'
        );
        if (dailyCaloriesGoals) {
          const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
          setDailygoal(parsedDailyCaloriesGoals);
        } else {
          setError('No daily goals found');
        }
      } catch (err) {
        setError('Error loading daily goals');
      } finally {
        setIsLoading(false);
      }
    };

    const getReportData = async () => {
      if (!report || !report.report) {
        setError('Invalid or missing report data');
        return;
      }
    };

    getDailyCaloriesGoals();
    //getReportData();
  }, [report]);

  const renderTitle = () => (
    <View style={{ marginVertical: 30 }}>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-evenly',
          marginTop: 24,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#177AD5',
              marginRight: 8,
            }}
          />
          <Text style={{ color: 'lightgray', fontFamily: 'Vazirmatn' }}>
            {i18n.t('yourIntake')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: '#ED6665',
              marginRight: 8,
            }}
          />
          <Text style={{ color: 'lightgray', fontFamily: 'Vazirmatn' }}>
            {i18n.t('yourGoal')}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderNutritionalData = () => {
    const data = [
      {
        label: i18n.t('calories'),
        intake: convertToPersianNumbers(
          report?.totalNutrition?.averageCalories || 0,
          RTL
        ),
        goal: dailygoal.dailyCalories || 0,
      },
      {
        label: i18n.t('carbs'),
        intake: convertToPersianNumbers(
          report?.totalNutrition?.averageCarbs || 0,
          RTL
        ),
        goal: convertToPersianNumbers(dailygoal.carbsGrams || 0, RTL),
      },
      {
        label: i18n.t('protein'),
        intake: convertToPersianNumbers(
          report?.totalNutrition?.averageProtein || 0,
          RTL
        ),
        goal: dailygoal.proteinGrams || 0,
      },
      {
        label: i18n.t('fats'),
        intake: convertToPersianNumbers(
          report?.totalNutrition?.averageFat || 0,
          RTL
        ),
        goal: dailygoal.fatGrams || 0,
      },
    ];

    return data.map((item, index) => (
      <View key={index} style={styles.dataRow}>
        <Text style={styles.dataLabel}>{item.label}:</Text>
        <Text style={styles.dataValue}>
          {' '}
          {item.intake} {i18n.t('calories')}
        </Text>
        {/* <Text style={styles.dataValue}> / {item.goal} (Goal)</Text> */}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      {status === 'loading' && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {/* {renderTitle()} */}
      {!isLoading && !error && renderNutritionalData()}
    </View>
  );
}

export default ListReport;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      textAlign: RTL ? 'right' : 'left',
      //justifyContent: 'center',
      //alignItems: 'center',
      width: Dimensions.get('window').width / 1.2,
      padding: 20,
      // backgroundColor: theme.colors.secondary,
      marginHorizontal: 10,
      height: Dimensions.get('window').height,
    },
    dataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 5,
      fontFamily: 'Vazirmatn',
    },
    dataLabel: {
      color: theme.colors.primary,
      fontWeight: 'bold',
      fontSize: 16,
      fontFamily: 'Vazirmatn',
    },
    dataValue: {
      color: theme.colors.primary,
      fontSize: 16,
      fontFamily: 'Vazirmatn',
    },
  });
