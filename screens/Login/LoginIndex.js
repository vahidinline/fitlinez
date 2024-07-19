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
import { useContext, useState, useEffect, useRef } from 'react';
import jwtDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authStorage from '../../api/storage';
import api from '../../api/api';
import { IconLogo } from '../marketplace/filters/icons';

function LoginIndex(props) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [token, setToken] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [status, setStatus] = useState('idle');

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const validateFields = () => {
    return email !== '' && password !== '';
  };

  useEffect(() => {
    const buttonDisabled = !validateFields();
    setBtnDisable(buttonDisabled);
  }, [email, password]);

  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('email');
        const storedPassword = await AsyncStorage.getItem('password');
        if (storedEmail) {
          setEmail(storedEmail);
        }
        if (storedPassword) {
          setPassword(storedPassword);
        }
        //emailInputRef.current.focus(); // Focus on email input when the component mounts
      } catch (error) {
        console.error('Failed to load stored credentials', error);
      }
    };
    loadStoredCredentials();
  }, []);

  const handleSubmit = async () => {
    setStatus('loading');

    api
      .post('/api/login', {
        userEmail: email,
        password: password,
        deviceType: Platform.OS,
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

              // Store email and password
              AsyncStorage.setItem('email', email);
              AsyncStorage.setItem('password', password);
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
          setStatus('error');
          setErrorMessage('An unexpected error occurred. Please try again.');
        }

        setStatus('error');
      });
  };

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

  const passwordValidate = (text) => {
    if (text.length < 6) {
      setPassword('');
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
        width: Dimensions.get('window').width,
      }}>
      <View style={{ backgroundColor: theme.colors.background }}>
        <View>
          <StatusBar style="auto" />
          <View
            style={{
              width: '100%',
              height: Dimensions.get('window').height / 3,
            }}>
            <View
              style={{
                // width: 200,
                height: 100,
                marginTop: 100,
                resizeMode: 'cover',
                alignSelf: 'center',
                borderRadius: 10,
              }}>
              <IconLogo />
            </View>

            {/* <Image
              style={{
                width: 200,
                height: 100,
                marginTop: 100,
                resizeMode: 'cover',
                alignSelf: 'center',
                borderRadius: 10,
              }}
              source={require('../../assets/logo.png')}
            /> */}

            <Text
              style={{
                color: theme.colors.text,
                fontSize: 8,
                fontFamily: 'Vazirmatn',
                textAlign: 'center',
                marginVertical: 10,
              }}>
              {' '}
              v. {process.env.EXPO_PUBLIC_VERSION}
            </Text>
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
            value={email}
            onChangeText={emailValidate}
            ref={emailInputRef}
            type="email"
          />
          <FloatingPlaceholderInput
            secureTextEntry={!showPass}
            icon="eye"
            placeholder={i18n.t('password')}
            value={password}
            onChangeText={passwordValidate}
            setShowPass={setShowPass}
            showPass={showPass}
            ref={passwordInputRef}
            type="password"
          />

          <Button
            loading={status === 'loading'}
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
                fontFamily: 'Vazirmatn',
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
              style={{
                color: theme.colors.secondary,
                alignSelf: 'flex-end',
                marginTop: -10,
                fontFamily: 'Vazirmatn',
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
                fontFamily: 'Vazirmatn',
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
              fontFamily: 'Vazirmatn',
            }}>
            {i18n.t('loginFooterText')}
            <Text
              onPress={() => navigation.navigate('Register')}
              style={{
                color: theme.colors.button,
                fontFamily: 'Vazirmatn',
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
    paddingVertical: 10,
  },
});

export default LoginIndex;
