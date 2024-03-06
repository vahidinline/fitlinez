import React from 'react';
import { IconAi } from '../marketplace/filters/icons';
import { Text } from '@rneui/themed';
import { Dimensions, View } from 'react-native';

function DefaultState({ theme, isRTL }) {
  return (
    <View
      style={{
        // justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
        width: Dimensions.get('window').width,
        textAlign: isRTL ? 'right' : 'left',
      }}>
      <IconAi
        name="robot"
        size={24}
        color={theme.colors.secondary}
        style={{ marginBottom: 10 }}
      />
      <Text
        style={{
          fontSize: 16,
          fontWeight: '400',
          color: theme.colors.text,
        }}>
        {' '}
        How can I help you today?
      </Text>
    </View>
  );
}

export default DefaultState;
