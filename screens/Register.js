import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import i18nt from '../locales';
import { StatusBar } from 'expo-status-bar';
import { Button, Icon, Input, useTheme } from '@rneui/themed';
import DropdownCountries from '../components/dropDown/countries';
import AuthContext from '../api/context';

import jwtDecode from 'jwt-decode';

const RegisterScreen = ({ email, setUserStatus }) => {
  //console.log('setUserStatus', setUserStatus);
  const authContext = useContext(AuthContext);
  const [location, setLocation] = useState(null);
  // const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [name, setName] = useState(null);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [isLoading, setIsLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [logintoken, setLoginToken] = useState('');
  const [btnDisable, setBtnDisable] = useState(true);
  const navigation = useNavigation();
  const [showPass, setShowPass] = useState(false);

  const buttonDisabled = () => {
    console.log('email', email);
    if (email !== null && password !== null && name !== null) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  useEffect(() => {
    buttonDisabled();
  }, [email, password, name]);

  const emailValidate = (text) => {
    console.log(text);
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

  // const registerForPushNotifications = async () => {
  //   const permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   try {
  //     if (!permission.granted) return;
  //     setExpoPushToken(await Notifications.getExpoPushTokenAsync());
  //   } catch (error) {
  //     console.log('Error getting a token', error);
  //   }
  // };

  // useEffect(() => {
  //   registerForPushNotifications();
  // }, []);

  const handleSubmit = async () => {
    setIsLoading(true);

    axios
      .post('https://jobitta.com/api/register', {
        email,
        password,
        name,
        location,
        expoPushToken: expoPushToken.data,
      })
      .then((res) => {
        console.log('res', res.data.status);
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
            console.error('JWT Decoding Error:');
            setIsLoading(false);
          }
          //Redirect(email, password);
        } else if (res.data.error === 'Username already in use') {
          setIsLoading(false);
          alert('Username already in use');
        } else {
          setIsLoading(false);
          // console.log(res.data);
        }
      })
      .catch((e) => {
        alert(e);
        console.log(e);
      });
  };
  return (
    <View
      style={{
        flexDirection: 'column',
        marginTop: Dimensions.get('window').height / 12,
        //justifyContent: 'space-between',
        width: Dimensions.get('window').width,
        // alignSelf: 'center',
        height: Dimensions.get('window').height / 1.2,
      }}>
      <Button
        onPress={() => setUserStatus(null)}
        buttonStyle={{
          backgroundColor: 'transparent',
          alignSelf: 'flex-start',
        }}
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          alignSelf: 'center',
          marginBottom: 20,
          color: theme.colors.primary,
        }}>
        Not your email?
      </Button>
      <Input
        type="email"
        style={styles.inputStyle}
        placeholder={i18n.t('email')}
        defaultValue={email}
        autoCorrect={false}
        onChange={(e) => setEmail(e)}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onChangeText={(text) => emailValidate(text)}
      />

      <Input
        placeholder={i18n.t('name')}
        autoCorrect={false}
        style={styles.inputStyle}
        autoCapitalize="none"
        keyboardType="default"
        returnKeyType="next"
        onChangeText={(e) => setName(e)}
      />

      <Input
        placeholder={i18n.t('createpassword')}
        autoCorrect={false}
        secureTextEntry={!showPass}
        style={styles.inputStyle}
        onChangeText={(text) => passwordValidate(text)}
        rightIcon={
          <Icon
            onPress={() => setShowPass(!showPass)}
            icon={showPass ? 'eye-off' : 'eye'}
          />
        }
      />

      <View
        style={{
          alignSelf: 'center',
        }}>
        <Button
          disabled={btnDisable}
          onPress={handleSubmit}
          containerStyle={{
            opacity: btnDisable ? 0.5 : 0.9,
            top: 30,
            marginBottom: 30,
            backgroundColor: `${btnDisable ? theme.colors.grey2 : 'orange'}`,
            height: Dimensions.get('window').height / 10,
            width: Dimensions.get('window').width / 1.3,
            height: 50,
            borderRadius: 5,
            justifyContent: 'center',
          }}
          type="clear"
          title={i18n.t('register')}
          titleStyle={{
            color: btnDisable ? theme.colors.primary : theme.colors.secondary,
            fontWeight: 'bold',
          }}
          loading={isLoading}
        />
      </View>
    </View>
  );
};

export default RegisterScreen;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    inputStyle: {
      fontSize: 16,
      backgroundColor: 'transparent',
      height: 50,
      color: theme.colors.primary,
    },
  });
