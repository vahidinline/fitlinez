import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getDailyCalorieInTake } from '../../api/dailyCalorieInTake';
import { useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DailyReport({ userId }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const getDailyReport = async () => {
    setStatus('loading');
    if (!userId) {
      setStatus('error');
      return;
    }
    const res = await getDailyCalorieInTake(userId);
    console.log('res', res);
    if (!res || res.length === 0) {
      setStatus('error');
      return;
    }
    setStatus('success');
    setResult(res);
  };

  useEffect(() => {
    //call this function in 2 seconds

    getDailyReport();
  }, [userId]);

  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      const dailyCaloriesGoals = await AsyncStorage.getItem(
        'dailyCaloriesGaols'
      );
      console.log('dailyCaloriesGaols', dailyCaloriesGoals);
      if (dailyCaloriesGoals) {
        const parsedDailyCaloriesGoals = JSON.parse(dailyCaloriesGoals);
        setDailyCalories(parsedDailyCaloriesGoals.dailyCalories);
        // setFatPercentage(parsedDailyCaloriesGoals.fatPercentage);
        // setProteinPercentage(parsedDailyCaloriesGoals.proteinPercentage);
        // setCarbsPercentage(parsedDailyCaloriesGoals.carbsPercentage);
      }
    };
    getDailyCaloriesGoals();
  }, []);
  console.log('dailyCalories', dailyCalories);
  return (
    <View style={styles.container}>
      {/* {status === 'success' && ( */}
      <View style={styles.baseContainer}>
        <Text
          style={{
            color: '#fff',
            fontSize: 30,
            textAlign: 'center',
            fontWeight: 'bold',
            margin: 10,
          }}>
          {result
            ? dailyCalories - result[0]?.totalCalories.toFixed(0)
            : dailyCalories}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontSize: 16,
            textAlign: 'center',
          }}>
          kcal
        </Text>
        <Text
          style={{
            color: '#fff',
            fontSize: 15,
            textAlign: 'center',
            fontWeight: 'bold',
            margin: 10,
          }}>
          Remaining
        </Text>
      </View>
      {/* )} */}
      {/* {status === 'success' && ( */}
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
      {/* )} */}
    </View>
  );
}

export default DailyReport;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5B5891',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 40,
    },
    nutrientText: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
      fontWeight: 'bold',
      margin: 5,
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
    nutrientContainer: {
      alignItems: 'left',
    },
  });
