import { Button, Icon, Input, useTheme } from '@rneui/themed';
import { Diagram } from 'iconsax-react-native';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import OneSvg from '../../assets/img/one.svg';
import SvgComponentOne from './assetss/one';
function StepOne() {
  const { theme } = useTheme();
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
            inputContainerStyle={{
              borderWidth: 0.5,
              borderRadius: 8,
            }}
            inputStyle={styles.input}
            labelStyle={styles.label}
          />
        </View>
      </ScrollView>
      <View
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
          title="Next"
        />
      </View>
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
