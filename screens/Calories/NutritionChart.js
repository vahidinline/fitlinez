import React from 'react';
import { View } from 'react-native';
// import { PieChart } from 'react-native-gifted-charts';

function NutritionChart() {
  const pieData = [
    { value: 54, color: '#177AD5', text: '54%' },
    { value: 30, color: '#79D2DE', text: '30%' },
    { value: 26, color: '#ED6665', text: '26%' },
  ];
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      }}>
      {/* <PieChart
        donut
        showText
        textColor="black"
        innerRadius={70}
        showTextBackground
        textBackgroundColor="white"
        textBackgroundRadius={22}
        data={pieData}
      /> */}
    </View>
  );
}

export default NutritionChart;
