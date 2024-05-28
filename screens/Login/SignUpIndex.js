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
  TouchableOpacity,
} from 'react-native';
import { Button, CheckBox, useTheme } from '@rneui/themed';
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
import {
  IconArrowLeft,
  IconArrowRight,
  IconLang,
} from '../marketplace/filters/icons';
import ChangeLanguage from '../settings/changeLanguage';
import { FlatList } from 'react-native-gesture-handler';
import langs from '../../data/langs';

function SignUpIndex(props) {
  const authContext = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const { theme } = useTheme();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [btnDisable, setBtnDisable] = useState(true);
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);
  const [checked, setChecked] = React.useState(false);
  const toggleCheckbox = () => setChecked(!checked);
  const [status, setStatus] = useState('idle');
  const [showLang, setShowLang] = useState(false);
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

  const handleSubmit = async () => {
    setStatus('loading');
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
          setStatus('success');
          try {
            const user = jwtDecode(res.data.data);

            if (user) {
              console.log('Decoded user data:'); // Log the decoded user data

              authContext.setUserAuth(user);
              authStorage.storeToken(user);
            } else {
              setStatus('error');
            }
          } catch (decodeError) {
            console.error(decodeError, 'JWT Decoding Error:');

            setStatus('error');
          }
          //Redirect(email, password);
        } else {
          alert(res.data.error);
          setStatus('error');
        }
        // } else {
        //   setIsLoading(false);
        //   console.log('last ', res.data);
        // }
      })
      .catch((e) => {
        alert(e);
      });
  };

  const handleShowLang = () => {
    console.log('showLang', showLang);
    setShowLang(!showLang);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' && 'height'}
      style={{
        backgroundColor: theme.colors.background,
        flex: 1,
        backgroundColor: theme.colors.background,
        width: Dimensions.get('window').width,
      }}>
      <View
        style={{
          backgroundColor: theme.colors.background,
        }}>
        <TouchableOpacity
          onPress={() => handleShowLang()}
          style={{
            position: 'absolute',
            top: Dimensions.get('window').height / 9,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.primary,
            height: Dimensions.get('window').height / 8,
            width: showLang ? '100%' : '10%',
            borderTopRightRadius: 20,
            borderBottomEndRadius: 20,
            backgroundColor: theme.colors.grey3,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            zIndex: 100,
          }}>
          <View
            style={{
              position: 'absolute',
              top: 0,

              bottom: 0,
              left: 0,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 100,
            }}>
            {showLang ? (
              <IconArrowLeft color={theme.colors.secondary} size={40} />
            ) : (
              <IconArrowRight color={theme.colors.secondary} size={40} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {showLang &&
              langs.map((lang, index) => (
                <TouchableOpacity
                  style={{
                    margin: 10,
                    borderRadius: 10,
                    backgroundColor: theme.colors.grey3,
                    padding: 10,
                  }}
                  key={index}
                  onPress={() => setUserLanguage(lang.value)}>
                  {lang.Flag && <lang.Flag />}
                  <Text
                    style={{
                      color: theme.colors.secondary,
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </TouchableOpacity>
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
            setShowPass={setShowPass}
            showPass={showPass}
            secureTextEntry={showPass}
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
            loading={status === 'loading' ? true : false}
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
