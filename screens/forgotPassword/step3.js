import { Button, Input, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, ScrollView, View, Text, StyleSheet } from 'react-native';
import Second from './assetss/second';

function StepThree({ password, setPassword, handleSubmit, i18n }) {
  const { theme } = useTheme();
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);

  useEffect(() => {
    // Check for minimum length
    if (password.length < 6) {
      setMessage(i18n.t('passwordshouldatleast'));
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
              fontFamily: 'Vazirmatn',
            }}>
            {i18n.t('newpassword')}
          </Text>
          <Input
            placeholder={i18n.t('enternewpassword')}
            secureTextEntry
            inputContainerStyle={styles.inputContainer}
            inputStyle={styles.input}
            onChangeText={setPassword}
          />
          <Input
            placeholder={i18n.t('enterpasswordagain')}
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
            titleStyle={{
              fontFamily: 'Vazirmatn',
            }}
            title={i18n.t('submit')}
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
    fontFamily: 'Vazirmatn',
    fontSize: 14,
    paddingHorizontal: 10,
    textAlign: 'left',
  },
  message: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Vazirmatn',
  },
});

export default StepThree;
