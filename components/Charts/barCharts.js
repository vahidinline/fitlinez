// import { Text, useTheme } from '@rneui/themed';
// import React from 'react';
// import { View } from 'react-native';
// import { Stop } from 'react-native-svg';
// import { Path } from 'react-native-svg';
// import { Defs } from 'react-native-svg';
// import { LinearGradient } from 'react-native-svg';
// import {
//   AreaChart,
//   BarChart,
//   Grid,
//   ProgressCircle,
// } from 'react-native-svg-charts';
// import * as shape from 'd3-shape';

// const GroupedBarChartExample = ({ totalWeight, sessionCount }) => {
//   console.log('totalWeight', totalWeight);
//   console.log('sessionCount', sessionCount); // Logging session count for debugging
//   const { theme } = useTheme();
//   // Create an array with a length equal to sessionCount, populated with random values
//   const sessionData = Array.from({ length: sessionCount }, () =>
//     Math.floor(Math.random() * 100)
//   ).map((value) => ({ value }));

//   let barData;

//   if (Array.isArray(totalWeight)) {
//     barData = [
//       {
//         data: totalWeight.map((value) => ({ value })),
//         svg: { fill: theme.colors.green },
//         value: totalWeight,
//       },
//       {
//         data: sessionData,
//         svg: { fill: theme.colors.orange },
//       },
//     ];
//   } else {
//     barData = [{ data: sessionData }];
//   }

//   return (
//     <ProgressCircle
//       style={{ height: 200 }}
//       progress={sessionCount / 33}
//       progressColor={'rgb(134, 65, 244)'}
//       startAngle={-Math.PI * 0.8}
//       endAngle={Math.PI * 0.8}
//     />
//   );
// };

// const BarCharts = () => {
//   console.log('inside barchart');
//   const { theme } = useTheme();
//   const data = [50, 60, 40, 65, 49, 24, 55, 85, 87, 30, 35, 53, 53, 24, 50];
//   const fill = theme.colors.green;

//   const Gradient = () => (
//     <Defs key={'gradient'}>
//       <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
//         <Stop offset={'0%'} stopColor={theme.colors.green} />
//         <Stop offset={'50%'} stopColor={theme.colors.grey0} />
//         <Stop offset={'100%'} stopColor={theme.colors.red} />
//       </LinearGradient>
//     </Defs>
//   );

//   const CUT_OFF = 20;

//   const Labels = ({ x, y, bandwidth, data }) =>
//     data.map((value, index) => (
//       <Text
//         key={index}
//         x={x(index) + bandwidth / 2}
//         y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
//         fontSize={14}
//         fill={value >= CUT_OFF ? 'white' : 'black'}
//         alignmentBaseline={'middle'}>
//         {value}
//       </Text>
//     ));

//   const Line = ({ line }) => (
//     <Path key={'line'} d={line} stroke={'rgb(134, 65, 244)'} fill={'none'} />
//   );

//   return (
//     <View
//       style={{
//         opacity: 0.5,
//       }}>
//       <AreaChart
//         style={{ height: 200 }}
//         data={data}
//         contentInset={{ top: 30, bottom: 30 }}
//         curve={shape.curveNatural}
//         svg={{ fill: 'rgba(134, 65, 244, 0.2)' }}>
//         <Grid />
//         <Line />
//       </AreaChart>
//     </View>
//   );
// };

// export { GroupedBarChartExample, BarCharts };
