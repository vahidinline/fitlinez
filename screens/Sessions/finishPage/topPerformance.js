import React from 'react';
import HigherPerformanceBack from '../../../assets/img/HigherPerformanceBack.png';
import { View, Image, Dimensions, Text } from 'react-native';
import {
  Icon100,
  IconHigherPerformance,
} from '../../../screens/marketplace/filters/icons';
import { useTheme } from '@rneui/themed';
import generateText from '../../../api/lastPageText';

function TopPerformance({ text, completionPercentage }) {
  const { theme } = useTheme();

  return (
    <View>
      <View
        style={{
          position: 'absolute',
          top: Dimensions.get('window').height / 5 - 50,
          zIndex: 1,
          width: 100,
          height: 100,
          justifyContent: 'center',
        }}>
        <Image source={HigherPerformanceBack} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: Dimensions.get('window').width / 1.1,
          }}>
          <IconHigherPerformance />
        </View>
      </View>
      <View
        style={{
          //position: 'absolute',
          top: Dimensions.get('window').height / 2.7,
          zIndex: 1,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: theme.colors.text,
            textAlign: 'center',
            fontFamily: 'Vazirmatn',
            color: theme.colors.secondary,
          }}>
          {generateText(completionPercentage)}
        </Text>
      </View>
    </View>
  );
}

export default TopPerformance;
