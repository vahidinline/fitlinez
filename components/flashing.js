import React, { useRef, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';

function Flashing() {
  const animation = useRef(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <View>
      <AnimatedLottieView
        ref={animation}
        autoPlay
        loop
        style={{
          height: 20,
          width: 20,
        }}
        source={require('../assets/flashing.json')}
      />
    </View>
  );
}

export default Flashing;
