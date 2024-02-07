import { Icon, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const FloatingPlaceholderInput = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChangeText = (text) => {
    setInputValue(text);
    if (props.onChangeText) {
      props.onChangeText(text);
      //console.log('text in change text', text);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        value={inputValue}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={props.placeholder}
      />
      {(isFocused || inputValue === '') && (
        <Text
          type={props.type}
          style={[styles.placeholder, { top: isFocused ? -10 : '20%' }]}>
          {props.placeholder}
        </Text>
      )}
      {/* {props.showPass && (
        <Icon
          onPress={() => props.onShowPassword()}
          name={props.showPass ? 'eye' : 'eye-slash'}
          type="font-awesome"
          size={20}
          color={theme.colors.secondary}
        /> 
      )}*/}
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    inputContainer: {
      position: 'relative',
      margin: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 0.2,
      paddingLeft: 10,
      borderRadius: 8,
    },
    placeholder: {
      position: 'absolute',
      left: 10,
      top: 0, // Adjust this value based on your design
      fontSize: 16,
      color: 'gray',
      backgroundColor: theme.colors.background,
      // transition: 'top 0.3s, font-size 0.3s',
    },
  });

export default FloatingPlaceholderInput;
