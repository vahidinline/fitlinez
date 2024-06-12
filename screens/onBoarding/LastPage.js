import { Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { IconVerfyBig } from '../marketplace/filters/icons-';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import { useNavigation } from '@react-navigation/core';
import { useEffect } from 'react';
import UserPrivilegeContext from '../../api/userPrivilegeContext';

function LastPageOnboarding() {
  const navigation = useNavigation();
  const { userAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userPrivilege } = useContext(UserPrivilegeContext);

  useEffect(() => {
    handlePress();
  }, []);

  const handlePress = () => {
    navigation.navigate('WorkoutListIndex');
    // navigator.reset({
    //   index: 0,
    //   routes: [{ name: 'Home' }],
    // });
    // if (userLevel === 4) {
    //   navigator.navigate('WorkoutListIndex');
    // } else {
    //   navigator.navigate('Upgrade');
    // }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Dimensions.get('window').height / 15,
        top: 0,
        alignItems: 'center',
      }}>
      <IconVerfyBig />
      <Text
        style={{
          top: 30,
          color: theme.colors.secondary,
          fontSize: 20,
          fontWeight: 'bold',
          justifyContent: 'flex-start',
          marginLeft: 20,
        }}>
        {i18n.t('Profilecreatedsuccessfully')}
      </Text>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    icon: {
      // marginRight: 10,
      // marginLeft: 10,
      // marginTop: 10,
      // // marginBottom: 10,
      // justifyContent: 'flex-start',
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
    },

    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // paddingTop: Dimensions.get('window').height / 15,
    },
    title: {
      fontSize: 14,
      fontWeight: '400',
      //marginHorizontal: 20,
      marginTop: 0,
      color: theme.colors.grey0,
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
      //marginHorizontal: 20,
      marginTop: 10,
      color: theme.colors.secondary,
    },
    fullBox: {
      //flex: 1,
      backgroundColor: theme.colors.background,
      //alignItems: 'ceer',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      height: Dimensions.get('window').height / 7,
      alignContent: 'center',
      justifyContent: 'center',
    },
    halfBox: {
      //flex: 1,
      backgroundColor: theme.colors.background,
      //alignItems: 'ceer',
      marginLeft: 20,
      // marginLeft: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      height: Dimensions.get('window').height / 10,
      width: Dimensions.get('window').width / 2 - 50,
      alignContent: 'center',
      justifyContent: 'center',
    },
    unit: {
      color: theme.colors.grey0,
      fontSize: 12,
      fontWeight: '400',
      paddingLeft: 15,
    },
  });

export default LastPageOnboarding;
