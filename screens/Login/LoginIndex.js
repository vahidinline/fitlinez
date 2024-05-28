import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Linking,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Button, Chip, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import FloatingPlaceholderInput from '../../components/inputs/entryInputs';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import { I18n } from 'i18n-js';
import { useContext } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import authStorage from '../../api/storage';
import api from '../../api/api';

function LoginIndex(props) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [status, setStatus] = useState('idle');

  const buttonDisabled = () => {
    if (email !== null && password !== null) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  useEffect(() => {
    buttonDisabled();
  }, [email, password]);

  const handleSubmit = async () => {
    setStatus('loading');

    console.log('Sending request with data:'); // Log the request data
    api
      .post('/api/login', {
        userEmail: email,
        password: password,
        deviceType: Platform.OS,
        //token: token.data,
      })
      .then((res) => {
        if (res.data) {
          setErrorMessage(res.data.error);
          setStatus('error');
          try {
            const user = jwtDecode(res.data.data);

            if (user) {
              setStatus('success');
              authContext.setUserAuth(user);
              authStorage.storeToken(user);
            } else {
              setStatus('error');
            }
          } catch (decodeError) {
            setStatus('error');
          }
        } else {
          setErrorMessage(res.data.error);
        }
      })
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.error) {
          setErrorMessage(e.response.data.error);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        setStatus('error');
      });
  };

  const emailValidate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    //lowercase validation

    if (reg.test(text) === false) {
      setEmail(null);
      return false;
    } else {
      setEmail(text.trim().toLowerCase());
    }
  };

  const passwordValidate = (text) => {
    //password length validation
    if (text.length < 6) {
      setPassword(null);
      return false;
    } else {
      setPassword(text.trim());
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? '' : 'height'}
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        // position: 'absolute',
        // top: -10,
        // left: 0,
        // right: 0,
        // bottom: 0,
        backgroundColor: theme.colors.background,
        width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
      }}>
      <View style={{ backgroundColor: theme.colors.background }}>
        <View>
          <StatusBar style="auto" />
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 3,
            }}>
            <Image
              style={{
                width: 200,
                height: 100,
                marginTop: 100,
                resizeMode: 'cover',
                alignSelf: 'center',
                borderRadius: 10,
              }}
              source={require('../../assets/logo.png')}
            />
          </View>
        </View>

        <View
          style={{
            width: '90%',
            height: 100,
            alignSelf: 'center',
          }}>
          <FloatingPlaceholderInput
            placeholder={i18n.t('email')}
            onChange={(e) => setEmail(e)}
            onChangeText={(text) => emailValidate(text)}
            type="email"
          />
          <FloatingPlaceholderInput
            //hid the password
            secureTextEntry={showPass}
            icon="eye"
            placeholder={i18n.t('password')}
            onChange={(e) => setPassword(e)}
            onChangeText={(text) => passwordValidate(text)}
            setShowPass={setShowPass}
            showPass={showPass}
            type="password"
          />

          <Button
            loading={status === 'loading' ? true : false}
            type="outline"
            disabled={btnDisable}
            onPress={handleSubmit}
            buttonStyle={[
              {
                marginTop: 20,
                borderRadius: 8,
                backgroundColor: theme.colors.button,
              },
              btnDisable && { backgroundColor: 'lightgrey' },
            ]}
            titleStyle={[
              {
                color: theme.colors.primary,
                fontSize: 16,
              },
              btnDisable && { color: '#fff' },
            ]}
            title={i18n.t('login')}
          />
          <View
            style={{
              marginTop: 30,
            }}>
            <Text
              onPress={() =>
                Linking.openURL('https://www.fitlinez.com/forgot-password')
              }
              //onPress={() => navigation.navigate('ForgotPassIndex')}
              style={{
                color: theme.colors.secondary,
                alignSelf: 'flex-end',
                marginTop: -10,
              }}>
              {i18n.t('ForgotPassword')}
            </Text>
          </View>
          {status === 'error' && (
            <Chip
              title={errorMessage}
              icon={{
                name: 'alert-circle',
                type: 'material-community',
                size: 20,
                color: theme.colors.primary,
              }}
              titleStyle={{
                color: theme.colors.primary,
                fontSize: 14,
                fontWeight: 'bold',
                textAlign: 'left',
              }}
              type="outline"
              containerStyle={{
                marginVertical: 15,
                backgroundColor: theme.colors.warning,
                borderColor: theme.colors.error,
                borderRadius: 8,
              }}
            />
          )}
        </View>
        <View
          style={{
            position: 'absolute',

            alignSelf: 'center',
            bottom: 100,
          }}>
          <Text
            style={{
              color: theme.colors.secondary,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            {i18n.t('loginFooterText')}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={{
                color: theme.colors.button,
              }}>
              {' '}
              {i18n.t('loginFooterText2')}
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: -8,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },

  input: {
    paddingVertical: 10, // Adjust as needed
  },
});

export default LoginIndex;
