import { useTheme } from '@rneui/themed';
import AnimatedLottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Dimensions } from 'react-native';

function FitlinezLoading() {
  const animation = useRef(null);
  // const { theme } = useTheme();
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      <AnimatedLottieView
        autoPlay
        loop
        ref={animation}
        style={{
          height: Dimensions.get('window').height / 10,
          //backgroundColor: '#eee',
          // zIndex: 1000,
        }}
        // Find more Lottie files at https://lottiefiles.com/featured
        source={require('../assets/FitlinezLoading.json')}
      />
    </View>
  );
}

export default FitlinezLoading;
