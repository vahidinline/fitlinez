import React, { forwardRef } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';

const FloatingPlaceholderInput = forwardRef((props, ref) => {
  const {
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    icon,
    setShowPass,
    showPass,
    type,
  } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{placeholder}</Text>
      <TextInput
        ref={ref}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={type === 'email' ? 'email-address' : 'default'}
      />
      {icon && (
        <Text onPress={() => setShowPass(!showPass)}>
          {showPass ? 'Hide' : 'Show'}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    color: '#888',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
});

export default FloatingPlaceholderInput;
