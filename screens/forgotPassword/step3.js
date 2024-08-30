import { Button, Input, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet } from 'react-native';
import Second from './assetss/second';

function StepThree({ password, setPassword, handleSubmit }) {
  const { theme } = useTheme();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);

  useEffect(() => {
    // Check for minimum length
    if (password.length < 6) {
      setMessage('Password should be at least 6 characters');
      setBtnDisable(true);
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setBtnDisable(true);
    } else {
      setMessage(''); // Clear message if everything is fine
      setBtnDisable(false);
    }
  }, [password, confirmPassword]);

  return (
    <View
      style={{
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width,
      }}>
      <ScrollView>
        <View
          style={{
            alignSelf: 'center',
            marginTop: Dimensions.get('window').height / 8,
            marginBottom: 20,
            width: 100,
            height: 100,
            borderRadius: 100,
            backgroundColor: theme.colors.text,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Second />
        </View>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            marginTop: 40,
          }}>
          <Text
            style={{
              fontSize: 15,
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            Set a new password to increase the security of your account.
          </Text>
          <Input
            placeholder="New Password"
            secureTextEntry
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            onChangeText={setPassword}
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            onChangeText={setConfirmPassword}
          />
          <Button
            disabled={btnDisable}
            onPress={handleSubmit}
            buttonStyle={{
              backgroundColor: theme.colors.button,
              borderRadius: 8,
              width: Dimensions.get('window').width / 1.2,
              marginHorizontal: 15,
            }}
            title="Submit"
          />
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 0.5,
    borderRadius: 8,
  },
  input: {
    paddingVertical: 10,
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default StepThree;
