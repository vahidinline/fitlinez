import React, { useContext, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import i18nt from '../locales';
import { Image, Tab, TabView, Text, useTheme } from '@rneui/themed';
import LoginScreen from './Login';
import RegisterScreen from './Register';
import PreLoginScreen from './preLogin';
const WelcomeScreen = ({ navigation }) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [index, setIndex] = useState(0);
  const [email, setEmail] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const [name, setName] = useState(null);

  return (
    // <SafeAreaView style={{ flex: 1 }}>
    <ImageBackground
      resizeMode="cover"
      //source={require('../assets/login.jpeg')}
      style={{ width: '100%', height: '100%' }}>
      <View style={{ top: Platform.OS === 'ios' ? 40 : 30 }}>
        <View
          style={{
            width: '100%',
            height: 100,
          }}>
          {/* <Image
            style={{
              width: 200,
              height: 100,

              marginTop: 0,
              resizeMode: 'cover',
            }}
            source={require('../assets/logoTransparent.png')}
          /> */}
        </View>

        {userStatus === null && (
          <PreLoginScreen
            setIsUser={setIsUser}
            setUserStatus={setUserStatus}
            setEmail={setEmail}
            setName={setName}
          />
        )}
        {userStatus === 'user' && (
          <LoginScreen
            setUserStatus={setUserStatus}
            email={email}
            name={name}
          />
        )}
        {userStatus === 'new' && (
          <RegisterScreen setUserStatus={setUserStatus} email={email} />
        )}
      </View>
    </ImageBackground>
    // </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.colors.orange,
    },
    button: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      width: '100%',
      height: 60,
      backgroundColor: theme.colors.primary,
    },
    countContainer: {
      alignItems: 'center',
      padding: 10,
    },
    tab: {
      color: '#fff',
      backgroundColor: 'transparent',
      fontWeight: 'bold',
    },
    Text: {
      color: '#fff',
      fontSize: 15,
      fontWeight: 'bold',
      width: '100%',
      alignSelf: 'center',
      textAlign: 'center',
      // fontFamily: 'custom-font',
    },
  });

export default WelcomeScreen;
