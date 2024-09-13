import React, { useEffect, useState } from 'react';
import { Dimensions, View, ActivityIndicator, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Pedometer } from 'expo-sensors';
import convertToPersianNumbers from '../../api/PersianNumber';

const WeeklyStepChart = ({ RTL, theme, i18n }) => {
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklySteps = async () => {
      const today = new Date();
      const stepData = [];
      const daysOfWeekLTR = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      const daysOfWeekRTL = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

      const daysOfWeek = RTL ? daysOfWeekRTL : daysOfWeekLTR;

      // Helper function to get the label based on the date and RTL setting
      const getDayLabel = (date, daysArray) => {
        const dayIndex = date.getDay(); // 0 (Sunday) to 6 (Saturday)
        return daysArray[dayIndex];
      };

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i); // Go back i days from today
        const steps = await fetchStepsForDate(date);

        // Determine if this bar represents today
        const isToday = date.toDateString() === today.toDateString();

        stepData.unshift({
          value: steps,
          label: getDayLabel(date, daysOfWeek),
          frontColor: isToday ? theme.colors.highlight : theme.colors.grey, // Highlight today's bar

          topLabelComponent: () => (
            <Text
              style={{
                color: isToday ? theme.colors.white : theme.colors.white,
                fontSize: 12,

                width: 150,
                // top: 50,
                fontFamily: 'Vazirmatn',
                //   transform: [{ rotate: '90deg' }],
              }}>
              {convertToPersianNumbers(steps, RTL) + ' ' + i18n.t('steps')}
            </Text>
          ),
        });
      }

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
        marginVertical: 0,
        width: Dimensions.get('window').width / 1.5,
      }}>
      <BarChart
        barWidth={16}
        noOfSections={4}
        barBorderRadius={4}
        horizontal
        frontColor={theme.colors.secondary}
        data={barData}
        isAnimated
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ opacity: 0 }}
        xAxisLabelTextStyle={{
          fontSize: 12,
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
    </View>
  );
};

export default WeeklyStepChart;
