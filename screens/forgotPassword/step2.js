import { Button, Icon, Input, useTheme } from '@rneui/themed';
import { Diagram } from 'iconsax-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView } from 'react-native';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

import Second from './assetss/second';
function StepTwo({ email, setVerifCode, handleSubmit, setStatus, verifCode }) {
  const { theme } = useTheme();
  const [btnDisable, setBtnDisable] = useState(true);
  const validateFields = useCallback(() => {
    return verifCode !== '';
  }, [verifCode]);

  useEffect(() => {
    const buttonDisabled = !validateFields();
    setBtnDisable(buttonDisabled);
  }, [verifCode]);
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
            backgroundColor: theme.colors.text,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Second />
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
            Enter the code sent to {email}
          </Text>
          <Input
            maxLength={4}
            type="number"
            keyboardType="decimal-pad"
            inputContainerStyle={{
              borderWidth: 0.5,
              borderRadius: 8,
              paddingStart: 10,
              justifyContent: 'center',
            }}
            inputStyle={styles.input}
            labelStyle={styles.label}
            onChangeText={(e) => setVerifCode(e)}
          />
        </View>
        <Button
          disabled={btnDisable}
          onPress={() => handleSubmit()}
          buttonStyle={{
            backgroundColor: theme.colors.button,
            borderRadius: 8,
            width: Dimensions.get('window').width / 1.1,
            marginHorizontal: 15,
          }}
          title="Submit"
        />
        <View
          style={{
            width: '90%',
            height: 100,
            alignSelf: 'center',
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/* <Text
            style={{
              color: theme.colors.secondary,
            }}>
            Resend Code in 00:30
          </Text> */}
          <Pressable onPress={() => setStatus('initial')}>
            <Text
              style={{
                color: theme.colors.secondary,
              }}>
              Edit Email Address
            </Text>
          </Pressable>
        </View>
      </ScrollView>
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
    textAlign: 'center',
  },
});

export default StepTwo;
