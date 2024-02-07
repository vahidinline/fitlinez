import React from 'react';
import { Input, Icon, useTheme } from '@rneui/themed';
import { Text } from '@rneui/base';
import { View } from 'react-native';

function NumberInput({
  label,
  placeholder,
  keyboardType,
  left,
  right,
  ...props
}) {
  const { theme } = useTheme();
  return (
    <Input
      containerStyle={{
        color: theme.colors.secondary,
        borderRadius: 30,
      }}
      inputStyle={{
        color: theme.colors.secondary,
        marginLeft: 20,
        marginTop: 15,
      }}
      placeholderTextColor={theme.colors.secondary}
      {...props}
      placeholder={placeholder}
      keyboardType={keyboardType}
      returnKeyType="done"
      inputContainerStyle={{
        backgroundColor: theme.colors.grey2,
        color: theme.colors.secondary,
        borderRadius: 30,
        height: 50,
        width: '50%',
      }}
    />
  );
}

export default NumberInput;
