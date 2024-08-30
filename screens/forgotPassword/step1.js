import { Button, Icon, Input, useTheme } from '@rneui/themed';
import { Diagram } from 'iconsax-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, ScrollView } from 'react-native';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import SvgComponentOne from './assetss/one';
import api from '../../api/api';
function StepOne({ setEmail, email, handleSubmit, status }) {
  const { theme } = useTheme();
  const [btnDisable, setBtnDisable] = useState(true);

  const validateFields = useCallback(() => {
    return email !== '';
  }, [email]);

  useEffect(() => {
    const buttonDisabled = !validateFields();
    setBtnDisable(buttonDisabled);
  }, [email]);

  const emailValidate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmail('');
      return false;
    } else {
      setEmail(text.trim().toLowerCase());
      //passwordInputRef.current.focus(); // Focus on password input after email validation
    }
  };

  return (
    <View
      style={{
        // backgroundColor: theme.colors.background,
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
            // backgroundColor: theme.colors.text,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SvgComponentOne />
        </View>
        <View
          style={{
            width: '90%',
            height: 100,
            alignSelf: 'center',
            marginTop: 40,
          }}>
          <Text
            style={{
              fontSize: 15,
              //fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            Enter your Email Address to receive verification code.
          </Text>
          <Input
            type="email"
            keyboardType="email-address"
            returnKeyType="done"
            inputContainerStyle={{
              borderWidth: 0.5,
              borderRadius: 8,
              paddingStart: 10,
            }}
            inputStyle={styles.input}
            labelStyle={styles.label}
            onChangeText={emailValidate}
            //onChangeText={(e) => setEmail(e)}
            // value={email}
          />
          <Button
            disabled={btnDisable}
            onPress={() => handleSubmit()}
            buttonStyle={{
              backgroundColor: theme.colors.button,
              borderRadius: 8,
              width: Dimensions.get('window').width / 1.2,
              marginHorizontal: 15,
            }}
            title="Submit"
          />
        </View>
      </ScrollView>
      {/* <View
        style={{
          position: 'absolute',
          bottom: 30,
          width: '90%',
          height: 100,
          justifyContent: 'center',
          alignSelf: 'center',

          // backgroundColor: theme.colors.green,
        }}>
        <Button
          buttonStyle={{
            marginTop: 20,
            borderRadius: 8,
            backgroundColor: theme.colors.button,
          }}
          onPress={() => setEmail()}
          title="Next"
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: -8,
    marginLeft: 10,
    fontSize: 14,
  },

  input: {
    paddingVertical: 10, // Adjust as needed
  },
});

export default StepOne;
