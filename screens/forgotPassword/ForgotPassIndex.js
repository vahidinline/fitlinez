import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';

import StepOne from './step1';
import { Text, useTheme } from '@rneui/themed';
import StepTwo from './step2';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { IconArrowLeft } from '../marketplace/filters/icons';
import api from '../../api/api';
import FitlinezLoading from '../../components/FitlinezLoading';
import StepThree from './step3';
import StepFour from './step4';

function ForgotPassIndex() {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('initial');
  const { theme } = useTheme();
  const navigator = useNavigation();
  const [email, setEmail] = useState('');
  const [verifCode, setVerifCode] = useState(null);
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  console.log('status in main forget', status);
  console.log('verifCode in main forget', verifCode);
  console.log('email', email);

  const handleSubmitEmail = async () => {
    setStatus('loading');
    console.log('inside handleSubmit forget', email);
    try {
      const res = await api.post(`/userauth/forgot-password`, {
        email,
        baseUrl: Platform.OS,
      });
      console.log('forget password result', res);

      if (res.data.status === 'ok') {
        setStatus('emailSent');
        setMessage('Email has been sent');
      } else {
        setStatus('errorEmail');
        setMessage('Error: Unable to send email');
      }
    } catch (error) {
      console.log(error);
      setStatus('errorEmail');
      setMessage('An error occurred while sending the email');
    }
  };

  const handleSubmitCode = async () => {
    try {
      await api
        .post(`/userauth/reset-password`, {
          email,
          verificationCode: verifCode,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.status == 'ok') {
            setStatus('verified');
            console.log(res.data.data);
          } else {
            setStatus('errorCode');
          }
        });
    } catch (error) {
      console.log(error);
      setStatus('errorCode');
    }
  };

  const handleSubmitPass = async (e) => {
    try {
      await api.post(`/userauth/new-password`, {
        email,
        password,
      });
      setMessage('Password reset successful');
      setStatus('success');
    } catch (error) {
      console.log(error.response.data);
      setStatus('errorPass');
      //setMessage(error.response.data);
    }
  };

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <Pressable
        onPress={() => navigation.navigate('Login')}
        style={{
          // flex: 0.07,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20,
          marginRight: 20,
        }}>
        <IconArrowLeft />
      </Pressable>
      <View
        style={{
          flex: 1,
        }}>
        {status === 'loading' && <FitlinezLoading />}
        {status === 'initial' && (
          <StepOne
            setEmail={setEmail}
            email={email}
            status={status}
            handleSubmit={handleSubmitEmail}
          />
        )}
        {status === 'emailSent' && (
          <StepTwo
            email={email}
            status={status}
            verifCode={verifCode}
            setVerifCode={setVerifCode}
            handleSubmit={handleSubmitCode}
            setStatus={setStatus}
          />
        )}

        {status === 'verified' && (
          <StepThree
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmitPass}
            setEmail={setEmail}
            status={status}
            email={email}
          />
        )}
        {status === 'success' && <StepFour />}
      </View>
      <View
        style={{
          flex: 1,
          //flexDirection: 'row',
          // justifyContent: 'space-between',
          position: 'absolute',
          bottom: 100,
          width: Dimensions.get('window').width - 40,

          marginHorizontal: 20,
        }}>
        {/* <Text>{message}</Text> */}
      </View>
    </SafeAreaView>
  );
}

export default ForgotPassIndex;

const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    height: Dimensions.get('window').height,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 100,
  },
});
