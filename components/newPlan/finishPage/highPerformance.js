import React from 'react';
import HighPerformanceBack from '../../../assets/img/HighPerformanceBack.png';
import { View, Image, Dimensions, Text } from 'react-native';
import {
  Icon100,
  IconHighPerformance,
} from '../../../screens/marketplace/filters/icons';
import { useTheme } from '@rneui/themed';
import generateText from '../../../api/lastPageText';

function HighPerformance({ text, completionPercentage }) {
  const { theme } = useTheme();

  return (
    <View style={{}}>
      <View
        style={{
          position: 'absolute',
          top: Dimensions.get('window').height / 5 - 50,
          zIndex: 1,
          width: 100,
          height: 100,
          justifyContent: 'center',
        }}>
        <Image source={HighPerformanceBack} />
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
          <IconHighPerformance />
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
          }}>
          {generateText(completionPercentage)}
        </Text>
      </View>
    </View>
  );
}

export default HighPerformance;
