import { useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { View } from 'react-native';

function FitlinezLoading() {
  const animation = useRef(null);
  const { theme } = useTheme();
  return (
    <View
      style={{
        height: '100%',
        backgroundColor: theme.colors.secondary,
        //flex: 1,
      }}>
      <AnimatedLottieView
        autoPlay
        ref={animation}
        style={{
          justifyContent: 'center',
          alignSelf: 'center',
          //backgroundColor: '#eee',
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/FitlinezLoading.json')}
      />
    </View>
  );
}

export default FitlinezLoading;
