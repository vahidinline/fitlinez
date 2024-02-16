import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  Linking,
  KeyboardAvoidingView,
} from 'react-native';
import { Button, CheckBox, Input, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import axios from 'axios';
import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from '../../api/context';
import { useEffect } from 'react';
import FloatingPlaceholderInput from '../../components/inputs/entryInputs';
import jwtDecode from 'jwt-decode';
import authStorage from '../../api/storage';

function SignUpIndex(props) {
  const authContext = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [isLoading, setIsLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [logintoken, setLoginToken] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);

  const buttonDisabled = () => {
    if (email !== null && password !== null && name !== null && checked) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  useEffect(() => {
    buttonDisabled();
  }, [email, password, name, checked]);

  const emailValidate = (text) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(text) === false) {
      setEmail(null);
      return false;
    } else {
      setEmail(text);
    }
  };

  const passwordValidate = (text) => {
    //password length validation
    if (text.length < 6) {
      setPassword(null);
      return false;
    } else {
      setPassword(text);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    axios
      .post('https://jobitta.com/api/register', {
        email,
        password,
        name,
        location,
        //expoPushToken: expoPushToken.data,
      })
      .then((res) => {
        console.log('res', res.data);
        if (res.data.status === 'ok') {
          setIsLoading(false);
          try {
            const user = jwtDecode(res.data.data);
            console.log('user', user);
            if (user) {
              console.log('Decoded user data:'); // Log the decoded user data
              setIsLoading(false);
              authContext.setUserAuth(user);
              authStorage.storeToken(user);
            } else {
              console.error('Decoded user data is empty or invalid');
              setIsLoading(false);
            }
          } catch (decodeError) {
            console.error(decodeError, 'JWT Decoding Error:');
            setIsLoading(false);
          }
          //Redirect(email, password);
        } else {
          setIsLoading(false);
          alert(res.data.error);
        }
        // } else {
        //   setIsLoading(false);
        //   console.log('last ', res.data);
        // }
      })
      .catch((e) => {
        alert(e);
        console.log(e);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' && 'height'}
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
      <View
        style={{
          backgroundColor: theme.colors.background,
          //flex: 1,
        }}>
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
            placeholder={i18n.t('name')}
            type="text"
            onChangeText={(e) => setName(e)}
          />
          <FloatingPlaceholderInput
            onChange={(e) => setEmail(e)}
            placeholder={i18n.t('email')}
            onChangeText={(text) => emailValidate(text)}
            type="email"
          />
          <FloatingPlaceholderInput
            type="password"
            onChangeText={(text) => passwordValidate(text)}
            placeholder={i18n.t('password')}
          />

          <View>
            <CheckBox
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor={theme.colors.secondary}
              checked={checked}
              onPress={toggleCheckbox}
              style={{
                marginTop: 10,
              }}
              textStyle={{
                color: theme.colors.secondary,
                fontSize: 12,
                fontWeight: 'normal',
              }}
              title={
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    // alignItems: 'center',
                    //justifyContent: 'center',
                    // textAlign: 'center',
                    marginTop: 10,
                  }}>
                  <Text>{i18n.t('signupTerms')} </Text>
                  <Text
                    style={{ textDecorationLine: 'underline' }}
                    onPress={() =>
                      Linking.openURL(
                        'https://www.fitlinez.com/terms-of-service'
                      )
                    }>
                    {i18n.t('termsandconditions')}
                  </Text>
                  <Text> {i18n.t('and')}</Text>
                  <Text
                    style={{ textDecorationLine: 'underline' }}
                    onPress={() =>
                      Linking.openURL('https://www.fitlinez.com/privacy-policy')
                    }>
                    {' '}
                    {i18n.t('privacypolicy')}
                  </Text>
                </View>
              }
            />
          </View>
          <Button
            disabled={btnDisable}
            type="outline"
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
            title={i18n.t('signUp')}
          />
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
            {i18n.t('signupFooterText')}
            <Text
              onPress={() => navigation.navigate('Login')}
              style={{
                color: theme.colors.button,
              }}>
              {' '}
              {i18n.t('signupFooterText2')}
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
  },

  input: {
    paddingVertical: 10, // Adjust as needed
  },
});

export default SignUpIndex;
