import { Text } from '@rneui/themed';
import React from 'react';
import { View } from 'react-native';
import { IconAiSad } from '../marketplace/filters/icons';

function ErrorIndex({ response, theme }) {
  console.log(response);
  return (
    <View
      style={{
        // flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
        flexDirection: 'row',
      }}>
      <IconAiSad />
      <Text
        style={{
          color: theme.colors.error,
          fontSize: 12,
          marginHorizontal: 5,
        }}>
        Error: Something went wrong. Please try again later.
      </Text>
    </View>
  );
}

export default ErrorIndex;
