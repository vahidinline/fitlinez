import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import axios from 'axios';
import AuthContext from '../api/context';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import i18nt from '../locales';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Button, Input, Text, useTheme } from '@rneui/themed';
import * as Notifications from 'expo-notifications';

const PreLoginScreen = ({ setUserStatus, setEmail: setUserEmail, setName }) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(null);
  const [btnDisable, setBtnDisable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  //console.log('errorMessage', errorMessage);

  const buttonDisabled = () => {
    if (email !== null) {
      setBtnDisable(false);
    } else {
      setBtnDisable(true);
    }
  };

  useEffect(() => {
    buttonDisabled();
  }, [email]);

  const handleSubmit = async () => {
    setIsLoading(true);
    axios
      .post('https://jobitta.com/api/prelogin', {
        email: email,
        deviceType: Platform.OS,
      })
      .then((res) => {
        const userStatus = res.data.valid;
        setUserEmail(email);
        setName(res.data.data);
        setUserStatus(userStatus === true ? 'user' : 'new');

        if (res.data && res.data.data) {
          setErrorMessage(res.data.error);
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

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'column',
          height: Dimensions.get('window').height / 10,
          //backgroundColor: theme.colors.secondary,
          alignSelf: 'center',
          borderRadius: 5,
        }}>
        <Text
          h3={true}
          h3Style={{
            color: theme.colors.primary,
            fontSize: 10,
            fontWeight: 'bold',
            top: 5,
            //marginBottom: 20,

            // width: Dimensions.get('window').width,
            //height: 25,
            padding: 10,
          }}>
          To start using or Login Fitlinez,
        </Text>
        <Text
          h3={true}
          h3Style={{
            color: theme.colors.primary,
            fontSize: 10,
            fontWeight: 'bold',

            marginBottom: 20,

            // width: Dimensions.get('window').width,
            // height: 25,
            padding: 10,
          }}>
          Please enter your email address
        </Text>
      </View>
      <Input
        type="email"
        style={styles.inputStyle}
        placeholder={i18n.t('email')}
        autoCorrect={false}
        onChange={(e) => setEmail(e)}
        autoCapitalize="none"
        keyboardType="email-address"
        returnKeyType="next"
        onChangeText={(text) => emailValidate(text)}
      />

      <View
        style={{
          flexDirection: 'column',
          //position: 'absolute',
          top: Dimensions.get('window').height / 6,
          bottom: Dimensions.get('window').height / 1.6,
          alignSelf: 'center',
        }}>
        <Button
          disabled={btnDisable}
          onPress={handleSubmit}
          containerStyle={{
            opacity: btnDisable ? 0.5 : 0.9,
            marginTop: 30,
            marginBottom: 20,
            backgroundColor: `${btnDisable ? theme.colors.grey2 : 'orange'}`,
            height: Dimensions.get('window').height / 15,
            width: Dimensions.get('window').width / 1.3,
            height: 50,
            borderRadius: 5,
            justifyContent: 'center',
          }}
          type="clear"
          title={i18n.t('next')}
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

export default PreLoginScreen;

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
