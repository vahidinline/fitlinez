import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import AuthContext from '../api/context';
import authStorage from '../api/storage';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import i18nt from '../locales';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Button, Icon, Input, Text, useTheme } from '@rneui/themed';
import * as Notifications from 'expo-notifications';

//console.log('validation', validationSchema);
const LoginScreen = ({ email, name, setUserStatus }) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

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
    setIsLoading(true);
    console.log('Sending request with data:'); // Log the request data
    axios
      .post('https://jobitta.com/api/login', {
        userEmail: email,
        password: password,
        deviceType: Platform.OS,
        //token: token.data,
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setErrorMessage(res.data.error);

          try {
            const user = jwtDecode(res.data.data);

            if (user) {
              setIsLoading(false);
              authContext.setUserAuth(user);
              authStorage.storeToken(user);
            } else {
              setIsLoading(false);
            }
          } catch (decodeError) {
            setIsLoading(false);
          }
        } else {
          setErrorMessage(res.data.error);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.error) {
          setErrorMessage(e.response.data.error);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again.');
        }
        setIsLoading(false);
      });
  };

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

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.colors.primary,
          }}>
          {i18n.t('welcome')} {name}
        </Text>
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
          Not you?
        </Button>
      </View>
      <Input
        type="email"
        style={styles.inputStyle}
        placeholder={i18n.t('email')}
        autoCorrect={false}
        onChange={(e) => setEmail(e)}
        defaultValue={email}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onChangeText={(text) => emailValidate(text)}
      />

      <Input
        type="password"
        placeholder={i18n.t('password')}
        autoCorrect={false}
        keyboardType="default"
        style={styles.inputStyle}
        onChangeText={(text) => passwordValidate(text)}
        secureTextEntry={showPass}
        rightIcon={
          <Icon
            onPress={() => setShowPass(!showPass)}
            name={showPass ? 'eye' : 'eye-slash'}
            type="font-awesome"
            size={20}
            color={theme.colors.primary}
          />
        }
      />
      {/* <DropdownCountries setLocation={setLocation} /> */}

      <View
        style={{
          flexDirection: 'column',
          //position: 'absolute',
          //top: Dimensions.get('window').height / 5,
          //bottom: Dimensions.get('window').height / 1.6,
          alignSelf: 'center',
        }}>
        <Button
          disabled={btnDisable}
          onPress={handleSubmit}
          containerStyle={{
            opacity: btnDisable ? 0.5 : 0.9,
            top: 30,
            marginBottom: 20,
            backgroundColor: `${btnDisable ? theme.colors.grey2 : 'orange'}`,
            height: Dimensions.get('window').height / 15,
            width: Dimensions.get('window').width / 1.3,
            height: 50,
            borderRadius: 5,
            justifyContent: 'center',
          }}
          type="clear"
          title={i18n.t('login')}
          titleStyle={{
            color: btnDisable ? theme.colors.primary : theme.colors.secondary,
            fontWeight: 'bold',
          }}
          loading={isLoading}
        />
        {errorMessage && (
          <Text
            h4={true}
            h4Style={{
              color: 'red',
              fontSize: 16,
              fontWeight: 'bold',
              top: 20,
            }}>
            {errorMessage}
          </Text>
        )}
      </View>
    </View>
  );
};

export default LoginScreen;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'transparent',

      padding: 16,
      flexDirection: 'column',
      marginTop: Dimensions.get('window').height / 8,
      //justifyContent: 'space-between',
      width: Dimensions.get('window').width,
      // alignSelf: 'center',
      height: Dimensions.get('window').height / 1.2,
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
