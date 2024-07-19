import { useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Dimensions, View } from 'react-native';

function FitlinezLoading() {
  const animation = useRef(null);
  const { theme } = useTheme();
  return (
    <AnimatedLottieView
      autoPlay
      ref={animation}
      style={{
        height: Dimensions.get('window').height / 10,
        justifyContent: 'center',
        alignSelf: 'center',
        //backgroundColor: '#eee',
        zIndex: 1000,
      }}
      // Find more Lottie files at https://lottiefiles.com/featured
      source={require('../assets/FitlinezLoading.json')}
    />
  );
}

export default FitlinezLoading;
