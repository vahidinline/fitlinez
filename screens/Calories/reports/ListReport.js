import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

function ListReport(report, i18n) {
  const [dailygoal, setDailygoal] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    setStatus('loading');
    if (!report || !report.report) {
      setStatus('error');
      setError('Invalid or missing report data');
      return;
    } else {
      setStatus('success');
    }
  }, [report]);

  const renderTitle = () => {
    return (
      <View style={{ marginVertical: 30 }}>
        <View
          style={{
            // flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            marginTop: 24,
            //  backgroundColor: 'yellow',
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
            <Text
              style={{
                width: 60,
                height: 16,
                color: 'lightgray',
              }}>
              your intake
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
            <Text
              style={{
                width: 60,
                height: 16,
                color: 'lightgray',
              }}>
              your goal
            </Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const getDailyCaloriesGoals = async () => {
      setIsLoading(true); // Set loading to true
      try {
        const dailyCaloriesGoals = await AsyncStorage.getItem(
          'dailyCaloriesGaols'
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
        setIsLoading(false); // Set loading to false
      }
    };

    const getReportData = async () => {
      if (!report || !report.report) {
        setError('Invalid or missing report data');
        return;
      }
    };

    getDailyCaloriesGoals();
    getReportData(); // Fetch and validate report data
  }, [report]);

  // Calculate bar data based on dailygoal and report
  const barData =
    isLoading || error
      ? [] // Show empty chart if loading or error
      : [
          // Calories
          {
            value: report?.report?.totalNutrition?.averageCalories || 0,
            labelComponent: () => customLabel('Calories'),
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#177AD5',
          },
          { value: dailygoal.dailyCalories || 0, frontColor: '#ED6665' },
          // Carbs
          {
            value: report?.report?.totalNutrition?.averageCarbs || 0,
            labelComponent: () => customLabel('Carbs'),
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#177AD5',
          },
          { value: dailygoal.carbsGrams || 0, frontColor: '#ED6665' },
          // Protein
          {
            value: report?.report?.totalNutrition?.averageProtein || 0,
            labelComponent: () => customLabel('Protein'),
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#177AD5',
          },
          { value: dailygoal.proteinGrams || 0, frontColor: '#ED6665' },
          // Fat
          {
            value: report?.report?.totalNutrition?.averageFat || 0,
            labelComponent: () => customLabel('Fat'),
            spacing: 2,
            labelWidth: 30,
            labelTextStyle: { color: 'gray' },
            frontColor: '#177AD5',
          },
          { value: dailygoal.fatGrams || 0, frontColor: '#ED6665' },
        ];

  const customLabel = (val) => {
    return (
      <View style={{ width: 90, height: 50, marginTop: 20 }}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontWeight: 'bold',
            fontSize: 14,
            marginHorizontal: 0,
          }}>
          {val}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {status === 'loading' && <Text>Loading...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {renderTitle()}
      {!isLoading && !error && (
        <BarChart
          horizontal
          data={barData}
          barWidth={10}
          spacing={60}
          roundedTop
          roundedBottom
          hideRules
          xAxisThickness={0}
          yAxisThickness={0}
          yAxisTextStyle={{
            color: 'gray',
            fontSize: 14,
            fontWeight: 'bold',
          }}
          noOfSections={3}
          maxValue={Math.max(...barData.map((item) => item.value)) * 1.2} // Adjust max value for better visualization
        />
      )}
    </View>
  );
}

export default ListReport;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: Dimensions.get('window').width / 1,
    },
  });
