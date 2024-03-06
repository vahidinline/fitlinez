import { Button, Input } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, KeyboardAvoidingView, View } from 'react-native';

function InputChat({ theme, message, setMessage, sendMessage }) {
  const [isMessageValid, setIsMessageValid] = useState(false);

  useEffect(() => {
    const isMessageValid = message.length >= 10 && message.length <= 150;
    setIsMessageValid(isMessageValid);

    return () => {
      setIsMessageValid(false);
    };
  }, [message]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? '' : 'height'}
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        position: 'absolute',
        top: 280,
        // left: 0,
        // right: 0,
        // bottom: 0,
        backgroundColor: theme.colors.background,
        // width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
      }}>
      <View
        style={{
          //zIndex: 100,
          position: 'absolute',
          // backgroundColor: theme.colors.secondary,
          bottom: 0,
          justifyContent: 'center',
          // alignItems: 'center',
          marginHorizontal: 40,
          flexDirection: 'row',
          width: Dimensions.get('window').width / 1.3,
        }}>
        <Input
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
        />

        <Button
          buttonStyle={{
            backgroundColor: !isMessageValid
              ? theme.colors.buttonbackground
              : theme.colors.button,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 10,
            marginLeft: 0,
            height: 40,
          }}
          titleStyle={{
            color: !isMessageValid
              ? theme.colors.background
              : theme.colors.white,
            fontWeight: '500',
            fontSize: 12,
          }}
          disabled={!isMessageValid}
          onPress={() => sendMessage()}>
          Ask me
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

export default InputChat;
