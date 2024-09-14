import React, { useEffect, useState } from 'react';
import { Dimensions, View, ActivityIndicator, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Pedometer } from 'expo-sensors';
import moment from 'moment'; // Import moment.js
import 'moment/locale/fa'; // For Persian locale (if needed)
import convertToPersianNumbers from '../../api/PersianNumber';

const WeeklyStepChart = ({ RTL, theme, i18n }) => {
  const [barData, setBarData] = useState([]);
  const [averageSteps, setAverageSteps] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySteps = async () => {
      const today = new Date();
      const stepData = [];
      let totalSteps = 0;

      // Set locale for moment based on RTL
      const locale = RTL ? 'fa' : 'en';
      moment.locale(locale); // Apply locale

      const getDayLabel = (date) => {
        return (
          <View
            style={{
              marginHorizontal: 15,
              padding: 4,
              width: 20,
            }}>
            <Text
              style={{
                color: theme.colors.secondary,
                fontSize: 8,
                fontFamily: 'Vazirmatn',
              }}>
              {moment(date).format('ddd')}
            </Text>
          </View>
        );
      };

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Go back i days from today
        const steps = await fetchStepsForDate(date);

        const isToday = date.toDateString() === today.toDateString();

        stepData.unshift({
          value: steps,
          label: getDayLabel(date), // Use moment.js to get the day label
          frontColor: isToday ? theme.colors.highlight : theme.colors.warning,
        });

        totalSteps += steps; // Add steps for the day to total
      }

      const average = totalSteps / 7; // Calculate average steps
      setAverageSteps(average);

      setBarData(stepData);
      setLoading(false);
    };

    const fetchStepsForDate = async (date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0); // Start of the day

      const end = new Date(date);
      end.setHours(23, 59, 59, 999); // End of the day

      const result = await Pedometer.getStepCountAsync(start, end);
      return result.steps;
    };

    fetchWeeklySteps();
  }, [RTL, theme]);

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 14,
        marginVertical: 10,
        //width: Dimensions.get('window').width / 1.1,
      }}>
      <BarChart
        barWidth={16}
        noOfSections={4}
        barBorderRadius={4}
        frontColor={theme.colors.secondary}
        data={barData}
        isAnimated
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{
          opacity: 1,
          fontSize: 10,
          color: theme.colors.secondary,
        }}
        xAxisLabelTextStyle={{
          fontSize: 10,
          fontFamily: 'Vazirmatn',
          color: theme.colors.secondary,
        }}
        hideRules
        yAxisLabelTextStyle={{
          fontSize: 12,
          fontFamily: 'Vazirmatn',
          color: theme.colors.secondary,
        }}
      />
      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          color: theme.colors.secondary,
          fontFamily: 'Vazirmatn',
          textAlign: 'center',
        }}>
        {i18n.t('averageSteps')}
        {': '}
        {convertToPersianNumbers(Math.round(averageSteps), RTL)}
      </Text>
    </View>
  );
};

export default WeeklyStepChart;
