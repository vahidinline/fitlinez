import { Button, Icon, Input, useTheme } from '@rneui/themed';
import { Diagram } from 'iconsax-react-native';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import OneSvg from '../../assets/img/one.svg';
import SvgComponentOne from './assetss/one';
import { useNavigation } from '@react-navigation/native';
function StepFour() {
  const { theme } = useTheme();
  const navigator = useNavigation();
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
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
              fontSize: 24,
              fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: 20,
              color: theme.colors.secondary,
            }}>
            Reset successful{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              //fontWeight: 'bold',
              alignSelf: 'center',
              marginBottom: 20,
            }}>
            You can now log in to your account{' '}
          </Text>
          <Button
            onPress={() => navigator.navigate('Login')}
            buttonStyle={{
              backgroundColor: theme.colors.button,
              borderRadius: 8,
              width: Dimensions.get('window').width / 1.2,
              marginHorizontal: 15,
            }}
            title="Back to Login"
          />
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
  },
});

export default StepFour;
