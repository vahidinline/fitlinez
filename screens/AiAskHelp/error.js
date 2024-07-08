import { Text } from '@rneui/themed';
import React from 'react';
import { Touchable, TouchableOpacity, View } from 'react-native';
import { IconAiSad } from '../marketplace/filters/icons';

function ErrorIndex({ response, theme, i18n, tryAgain, isRTl }) {
  console.log(response);
  return (
    <View
      style={{
        // flex: 1,
        alignItems: 'center',
        marginHorizontal: 5,
        flexDirection: 'row',
        direction: isRTl ? 'rtl' : 'ltr',
      }}>
      <IconAiSad />
      <Text
        style={{
          color: theme.colors.error,
          fontSize: 12,
          marginHorizontal: 5,
          fontFamily: 'Vazirmatn',
        }}>
        {i18n.t('aihelperror')}
      </Text>
      <TouchableOpacity onPress={() => tryAgain()}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 12,
            marginHorizontal: 5,
            fontFamily: 'Vazirmatn',
          }}>
          {i18n.t('tryagain')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default ErrorIndex;
