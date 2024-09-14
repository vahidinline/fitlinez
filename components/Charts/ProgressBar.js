// import { View } from 'react-native';
// import SVG, { Circle } from 'react-native-svg';
// import Animated, {
//   useAnimatedProps,
//   useSharedValue,
//   withTiming,
// } from 'react-native-reanimated';
// import { useEffect } from 'react';

// const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// const color = '#EE0F55';

// const RingProgress = ({ radius = 100, strokeWidth = 35, progress }) => {
//   const innerRadius = radius - strokeWidth / 2;
//   const circumference = 2 * Math.PI * innerRadius;

//   const fill = useSharedValue(0);

//   useEffect(() => {
//     fill.value = withTiming(progress, { duration: 1500 });
//   }, [progress]);

//   const animatedProps = useAnimatedProps(() => ({
//     strokeDasharray: [circumference * fill.value, circumference],
//   }));

//   const circleDefaultProps = {
//     r: innerRadius,
//     cx: radius,
//     cy: radius,
//     originX: radius,
//     originY: radius,
//     strokeWidth: strokeWidth,
//     stroke: color,
//     strokeLinecap: 'round',
//     rotation: '-90',
//   };

//   return (
//     <View
//       style={{
//         width: radius * 2,
//         height: radius * 2,
//         alignSelf: 'center',
//       }}>
//       <SVG>
//         {/* Background */}
//         <Circle {...circleDefaultProps} opacity={0.2} />
//         {/* Foreground */}
//         <AnimatedCircle animatedProps={animatedProps} {...circleDefaultProps} />
//       </SVG>
//       {/* <AntDesign
//         name="arrowright"
//         size={strokeWidth * 0.8}
//         color="black"
//         style={{
//           position: 'absolute',
//           alignSelf: 'center',
//           top: strokeWidth * 0.1,
//         }}
//       /> */}
//     </View>
//   );
// };

// export default RingProgress;
