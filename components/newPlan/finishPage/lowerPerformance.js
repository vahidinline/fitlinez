import React from 'react';
import FullLow from '../../../assets/img/fullLow.png';
import { View, Image, Dimensions } from 'react-native';
import {
  Icon100,
  IconLowPerformance,
} from '../../../screens/marketplace/filters/icons';
import { Text, useTheme } from '@rneui/themed';
import generateText from '../../../api/lastPageText';

function LowPerformance({ text, completionPercentage }) {
  // console.log('completionPercentage', generateText(completionPercentage));
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
        <Image source={FullLow} />
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: Dimensions.get('window').width / 1.1,
          }}>
          <IconLowPerformance />
        </View>
      </View>
      <View
        style={{
          //position: 'absolute',
          top: Dimensions.get('window').height / 2.7,
          zIndex: 1,
        }}>
        {/* <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: theme.colors.secondary,
            textAlign: 'center',
          }}>
          {generateText(completionPercentage)}
        </Text> */}
      </View>
    </View>
  );
}

export default LowPerformance;
