import React from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { Svg } from 'react-native-svg';
import StepOne from './step1';
import { Button, Text, useTheme } from '@rneui/themed';
import StepTwo from './step2';
import StepThree from './step3';
import StepFour from './step4';
import { Icon } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

function ForgotPassIndex() {
  const [currentStep, setCurrentStep] = React.useState(0);
  const { theme } = useTheme();
  const navigator = useNavigation();
  const steps = [<StepOne />, <StepTwo />, <StepThree />, <StepFour />];
  const onPrev = () => {
    // move the step back
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigator.navigate('Login');
    }
  };
  const onNext = () => {
    // move the step forward
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <View
        style={{
          // flex: 0.07,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20,
          marginRight: 20,
        }}>
        <Icon
          onPress={onPrev}
          type="font-awesome-5"
          name="chevron-left"
          size={30}
        />
      </View>
      <View
        style={{
          flex: 1,
          //flexDirection: 'row',
          // justifyContent: 'space-between',
          // marginTop: 20,
          // marginLeft: 20,
          // marginRight: 20,
        }}>
        {/* all steps will be show here one by one */}
        {steps[currentStep]}
      </View>
      <View
        style={{
          flex: 1,
          //flexDirection: 'row',
          // justifyContent: 'space-between',
          position: 'absolute',
          bottom: 100,
          width: Dimensions.get('window').width - 40,
          marginLeft: 20,
          marginRight: 20,
        }}>
        <Button
          buttonStyle={{
            marginTop: 20,
            borderRadius: 8,
            backgroundColor: theme.colors.button,
          }}
          onPress={onNext}
          title="Next"
        />
      </View>
    </SafeAreaView>
  );
}

export default ForgotPassIndex;

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 100,
  },
});
