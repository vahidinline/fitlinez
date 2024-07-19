import { Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import { VictoryPie, VictoryAnimation, VictoryLabel } from 'victory-native';

// Helper function to generate data based on percent
function getData(percent, total) {
  if (percent > 100) {
    return [
      { x: 1, y: 100 },
      { x: 2, y: percent - 100 },
    ];
  }
  return [
    { x: 1, y: percent },
    { x: 2, y: total - percent },
  ];
}

const getColorBasedOnValue = (datum, theme) => {
  if (datum.x === 1) {
    if (datum.y > 100) {
      return theme.colors.error;
    } else if (datum.y > 75) {
      return theme.colors.warning;
    } else if (datum.y > 50) {
      return theme.colors.lightSuccess;
    } else {
      return theme.colors.success;
    }
  } else {
    return theme.colors.success;
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
    data: getData(0, 100),
  });

  useEffect(() => {
    let currentPercent = 0;
    const validDailyGoal = dailyGoal > 0 ? dailyGoal : 1; // Ensure dailyGoal is not zero or negative
    const validTakenCalories = takenCalories >= 0 ? takenCalories : 0; // Ensure takenCalories is not negative
    const targetPercent = (validTakenCalories / validDailyGoal) * 100;

    if (isNaN(targetPercent) || !isFinite(targetPercent)) {
      console.error('Invalid targetPercent value:', targetPercent);
      return;
    }

    const increment = targetPercent / 20;
    const intervalTime = 100;

    const setStateInterval = setInterval(() => {
      currentPercent += increment;
      if (currentPercent >= targetPercent) {
        currentPercent = targetPercent;
        clearInterval(setStateInterval);
      }
      setState({
        percent: currentPercent,
        data: getData(currentPercent, 100),
      });
    }, intervalTime);

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
          {(newProps) => (
            <VictoryLabel
              textAnchor="middle"
              verticalAnchor="middle"
              x={200}
              y={200}
              text={
                shownumber
                  ? `${Math.round(takenCalories)}/${dailyGoal}`
                  : takenCalories > dailyGoal
                  ? `Over ${Math.round(newProps.percent - 100)}%`
                  : `${Math.round(newProps.percent)}%`
              }
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                fill: 'white',
                fontFamily: 'Vazirmatn',
              }}
            />
          )}
        </VictoryAnimation>
      </Svg>
    </View>
  );
};

export default RoundAnimationChart;
