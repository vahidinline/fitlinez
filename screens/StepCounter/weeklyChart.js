import React, { useEffect, useState } from 'react';
import { Dimensions, View, ActivityIndicator, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Pedometer } from 'expo-sensors';
import moment from 'moment';
import 'moment/locale/fa';
import convertToPersianNumbers from '../../api/PersianNumber';

const WeeklyStepChart = ({ RTL, theme, i18n }) => {
  const [barData, setBarData] = useState([]);
  const [averageSteps, setAverageSteps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yAxisLabels, setYAxisLabels] = useState([]);

  useEffect(() => {
    const fetchWeeklySteps = async () => {
      const today = new Date();
      const stepData = [];
      let totalSteps = 0;

      const locale = RTL ? 'fa' : 'en';
      moment.locale(locale);

      const getDayLabel = (date) => (
        <View style={{ marginHorizontal: 15, padding: 4, width: 20 }}>
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

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const steps = await fetchStepsForDate(date);

        const isToday = date.toDateString() === today.toDateString();

        stepData.unshift({
          value: steps,
          label: getDayLabel(date),
          frontColor: isToday ? theme.colors.highlight : theme.colors.warning,
        });

        totalSteps += steps;
      }

      const average = totalSteps / 7;
      setAverageSteps(average);

      const maxValue = Math.max(...stepData.map((data) => data.value));
      setYAxisLabels(getYAxisLabels(maxValue, RTL).reverse()); // Reverse the order

      setBarData(stepData);
      setLoading(false);
    };

    const fetchStepsForDate = async (date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const result = await Pedometer.getStepCountAsync(start, end);
      return result.steps;
    };

    const getYAxisLabels = (maxValue, RTL) => {
      const labels = [];
      const step = Math.ceil(maxValue / 4);
      for (let i = 0; i <= 4; i++) {
        const value = step * i;
        labels.push(convertToPersianNumbers(value, RTL));
      }
      return labels;
    };

    fetchWeeklySteps();
  }, [RTL, theme]);

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} />;
  }

  return (
    <View
      style={{ marginHorizontal: 20, borderRadius: 14, marginVertical: 10 }}>
      <View style={{ position: 'relative' }}>
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
            opacity: 0,
          }}
          hideRules
        />

        {/* Render y-axis labels */}
        {yAxisLabels.map((label, index) => (
          <Text
            key={index}
            style={{
              position: 'absolute',
              left: 0,
              top: index * 40, // Adjust as needed based on sorted labels
              fontSize: 12,
              fontFamily: 'Vazirmatn',
              color: theme.colors.secondary,
            }}>
            {label}
          </Text>
        ))}
      </View>
      <Text
        style={{
          marginTop: 10,
          fontSize: 16,
          color: theme.colors.secondary,
          fontFamily: 'Vazirmatn',
          textAlign: 'center',
        }}>
        {i18n.t('averageSteps')} {': '}
        {convertToPersianNumbers(Math.round(averageSteps), RTL)}
      </Text>
    </View>
  );
};

export default WeeklyStepChart;
