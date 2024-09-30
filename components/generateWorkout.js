import React, { useState } from 'react';
import { generateWorkoutPlan } from '../api/generateWorkoutPlan';
import { Dimensions, View } from 'react-native';
import { Button, Text, useTheme } from '@rneui/themed';
import {
  IconHigherPerformance,
  IconLoading,
  IconPremium,
} from '../screens/marketplace/filters/icons';
import { useNavigation } from '@react-navigation/native';

function GenerateWorkout({ userId }) {
  const { theme } = useTheme;
  const navigation = useNavigation();
  const [status, setStatus] = useState('idle'); // Change setStatue to setStatus
  const requestForPlan = async () => {
    setStatus('loading');
    console.log('requestForPlan');
    await generateWorkoutPlan(userId, navigation, setStatus);
  };

  return (
    <View>
      <Button
        buttonStyle={{
          width: Dimensions.get('window').width / 1.1,
          //backgroundColor: theme.colors.button,
          marginHorizontal: 15,
          borderRadius: 12,
        }}
        onPress={() => requestForPlan()}>
        <Text
          style={{
            fontFamily: 'Vazirmatn',
            paddingHorizontal: 5,
          }}>
          Ask AI to generate Plan
          {status === 'error' && <IconHigherPerformance />}
          {status === 'loading' && <IconLoading />}
          {status === 'success' && 'موفقیت'}
        </Text>
      </Button>
    </View>
  );
}

export default GenerateWorkout;
