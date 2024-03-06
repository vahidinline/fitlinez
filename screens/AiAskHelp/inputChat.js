import { Button, Input } from '@rneui/themed';
import React from 'react';
import { Dimensions, View } from 'react-native';

function InputChat({ theme, title, category, sendMessage }) {
  return (
    <View
      style={{
        //flex: 1,
        //zIndex: 100,
        // position: 'absolute',
        // backgroundColor: theme.colors.secondary,
        bottom: 20,
        top: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 40,

        width: Dimensions.get('window').width / 1.1,
        height: 100,
      }}>
      {/* <Input
        inputStyle={{
          color: theme.colors.text,
          fontSize: 12,
          fontWeight: '500',
          paddingHorizontal: 10,
        }}
        style={{
          flex: 1,
          borderRadius: 10,
          borderColor: theme.colors.border,
          borderWidth: 1,
          backgroundColor: theme.colors.background,
        }}
        placeholder="Type your question so I can help you!"
        placeholderTextColor={theme.colors.border}
        onChangeText={(value) => setMessage(value)}
        value={message}
      /> */}
      <Button
        buttonStyle={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 10,
          marginLeft: 0,
          height: 40,
        }}
        titleStyle={{
          color: theme.colors.secondary,
          fontWeight: '500',
          fontSize: 12,
        }}
        onPress={() => sendMessage()}>
        Help me to do it
      </Button>
    </View>
  );
}

export default InputChat;
