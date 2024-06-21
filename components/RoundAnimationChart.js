import { Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory-native';

// Helper function to generate data based on percent
function getData(percent, total) {
  // Percent can be over 100 if takenCalories exceed dailyGoal
  if (percent > 100) {
    return [
      { x: 1, y: 100 }, // The goal portion (100%)
      { x: 2, y: percent - 100 }, // The excess portion
    ];
  }
  return [
    { x: 1, y: percent }, // The consumed portion
    { x: 2, y: total - percent }, // The remaining portion
  ];
}

const getColorBasedOnValue = (datum, theme) => {
  // Apply colors based on the slice
  if (datum.x === 1) {
    // If it's the primary portion
    if (datum.y > 100) {
      return theme.colors.error; // Red for overconsumption
    } else if (datum.y > 75) {
      return theme.colors.warning; // Yellow for close to goal
    } else if (datum.y > 50) {
      return theme.colors.lightSuccess; // Blue for halfway to goal
    } else {
      return theme.colors.success; // Green for below halfway
    }
  } else {
    // The remaining or excess portion
    return theme.colors.white; // Grey for the remaining or excess
  }
};

const RoundAnimationChart = ({
  shownumber,
  dailyGoal,
  takenCalories,

  size,
}) => {
  const { theme } = useTheme();
  const [state, setState] = useState({
    percent: 0,
    data: getData(0, dailyGoal),
  });
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    let currentPercent = 0;
    const targetPercent = (takenCalories / dailyGoal) * 100; // Calculate the target percent
    const increment = targetPercent / 20; // This controls the speed of the animation
    const intervalTime = 100; // Time in milliseconds between updates

    const setStateInterval = setInterval(() => {
      currentPercent += increment;
      if (currentPercent >= targetPercent) {
        currentPercent = targetPercent;
        clearInterval(setStateInterval); // Stop the interval once we reach the target value
      }
      setState({
        percent: currentPercent,
        data: getData(currentPercent, 100), // Always treat as percentage for the pie chart
      });
    }, intervalTime);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(setStateInterval);
    };
  }, [dailyGoal, takenCalories]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 400 400">
        <VictoryPie
          standalone={false}
          animate={{ duration: 1000 }}
          width={400}
          height={400}
          data={state.data}
          innerRadius={120}
          cornerRadius={25}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => getColorBasedOnValue(datum, theme),
            },
          }}
        />

        <VictoryAnimation duration={1000} data={state}>
          {(newProps) => {
            return (
              <VictoryLabel
                textAnchor="middle"
                verticalAnchor="middle"
                x={200}
                y={200}
                text={
                  shownumber
                    ? `${
                        Math.round(takenCalories)
                          ? Math.round(takenCalories)
                          : 0
                      }/${dailyGoal}`
                    : takenCalories > dailyGoal
                    ? `Over ${Math.round(newProps.percent - 100)}%`
                    : `${Math.round(newProps.percent)}%`
                }
                style={{
                  fontSize: 30,
                  fontWeight: 'bold',
                  fill: 'white',
                  fontFamily: 'Vazirmatn',
                }} // Use 'fill' instead of 'color' for SVG text
              />
            );
          }}
        </VictoryAnimation>
      </Svg>
    </View>
  );
};

export default RoundAnimationChart;
