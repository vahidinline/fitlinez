import { useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';

function HeartBreat() {
  const animation = useRef(null);
  const { theme } = useTheme();

  return (
    <AnimatedLottieView
      autoPlay
      ref={animation}
      style={{
        height: 100,
        width: 100,
        justifyContent: 'center',
        alignSelf: 'center',
        //backgroundColor: '#eee',
        zIndex: 1000,
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={require('../assets/heartbreat.json')}
    />
  );
}

export default HeartBreat;
