import React, { useEffect, useState } from 'react';
import { Dimensions, PixelRatio, StyleSheet, Text, View } from 'react-native';
import { getDailyCalorieInTake } from '../../api/dailyCalorieInTake';
import { useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

function DailyReport({ userId }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState([]);
  const [dailyCalories, setDailyCalories] = useState(0);
  console.log('dailyCalories in daily', dailyCalories);
  console.log('result in daily', result);
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

  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      const dailyCaloriesGoals = await AsyncStorage.getItem(
        'dailyCaloriesGaols'
      );
      if (dailyCaloriesGoals) {
        const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
        console.log(
          'parsedDailyCaloriesGoals',
          Number(parsedDailyCaloriesGoals.dailyCalories)
        );
        setDailyCalories(Number(parsedDailyCaloriesGoals.dailyCalories));
      }
      if (!dailyCaloriesGoals) {
        setStatus('noData');
      }
    };

    getDailyCaloriesGoals();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#5B5891', '#3A366F', '#17124A']}
        style={styles.background}
      />
      {status === 'noData' && (
        <Text style={styles.noDataText}>No daily calories goals set</Text>
      )}
      {status === 'success' && (
        <>
          <View style={styles.baseContainer}>
            <Text style={styles.caloriesText}>
              {result.length > 0
                ? dailyCalories - result[0]?.totalCalories.toFixed(0)
                : dailyCalories}
            </Text>
            <Text style={styles.kcalText}>kcal</Text>
            <Text style={styles.remainingText}>Remaining</Text>
          </View>
          <View style={styles.nutrientContainer}>
            <Text style={styles.nutrientText}>
              Calories: {result && result[0]?.totalCalories.toFixed(0)} g
            </Text>
            <Text style={styles.nutrientText}>
              Protein: {result && result[0]?.totalProtein.toFixed(0)} g
            </Text>
            <Text style={styles.nutrientText}>
              Fats: {result && result[0]?.totalFat.toFixed(0)} g
            </Text>
            <Text style={styles.nutrientText}>
              Carbs: {result && result[0]?.totalCarbs.toFixed(0)} g
            </Text>
            <Text style={styles.nutrientText}>
              Fiber: {result && result[0]?.totalFiber.toFixed(0)} g
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

export default DailyReport;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5B5891',
      justifyContent: 'center',
      alignItems: 'center',
      //marginHorizontal: 20,
      padding: 30,
      borderRadius: 14,
      //width: Dimensions.get('window').width / 1.1,
      marginVertical: 10,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 14,
    },
    noDataText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    baseContainer: {
      borderWidth: 5,
      borderColor: theme.colors.grey3,
      borderRadius: 75,
      width: 150,
      height: 150,
      margin: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    caloriesText: {
      color: '#fff',
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: 10,
    },
    kcalText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    remainingText: {
      color: '#fff',
      fontSize: 15,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: 10,
    },
    nutrientContainer: {
      alignItems: 'right',
    },
    nutrientText: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: 5,
    },
  });
