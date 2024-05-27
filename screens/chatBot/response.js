import { Text } from '@rneui/themed';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { IconAi } from '../marketplace/filters/icons-';

function ChatResponse({ response, isRTL, theme }) {
  return (
    <View
      style={{
        // justifyContent: 'center',
        // marginTop: 50,
        alignItems: 'center',
        padding: 20,
        flexDirection: 'row',
        // zIndex: 0,
        //backgroundColor: theme.colors.green,
        // height: Dimensions.get('window').height / 3,
        width: Dimensions.get('window').width,
        // textAlign: isRTL ? 'right' : 'left',
        direction: isRTL ? 'rtl' : 'ltr',
      }}>
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          marginHorizontal: 5,
          paddingHorizontal: 10,
        }}>
        <IconAi name="robot" size={24} color={theme.colors.secondary} />
      </View>

      <Text
        style={{
          marginHorizontal: 30,
          fontSize: 16,
          fontWeight: '400',
          color: theme.colors.text,
        }}>
        {response}
      </Text>
    </View>
  );
}

export default ChatResponse;
