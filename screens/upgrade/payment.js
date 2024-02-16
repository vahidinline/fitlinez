import React, { useContext, useEffect, useState } from 'react';
import { userLevelCheck } from '../../api/GetData';
import AuthContext from '../../api/context';
import { Button, LinearProgress, Text, useTheme } from '@rneui/themed';
import { Dimensions, Linking, SafeAreaView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import Header from '../../components/header';

function ConfirmPayment() {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [progress, setProgress] = useState(0);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const userLevel = userAuth.level;
  const navigator = useNavigation();
  const [count, setCount] = useState(0);
  const { theme } = useTheme();
  useEffect(() => {
    // Initialize the interval
    const interval = setInterval(() => {
      // Your logic here
      userLevelCheck(userAuth, setUserAuth);
      // console.log('userAuth level at upgrade', userAuth?.level);

      // Increment the count
      setCount((prevCount) => prevCount + 1);
    }, 5000); // 5 seconds

    // Clear the interval after 10 times
    if (count >= 5) {
      clearInterval(interval);
      setResult(
        userLevel === 0
          ? `${i18n.t('contactSupport')}`
          : `${i18n.t('SuccessPayment')}`
      );
    }

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [count, userAuth]);

  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        height: Dimensions.get('window').height,
        paddingTop: 80,
      }}>
      <Header title={i18n.t('checkingForUpdates')} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: '700',
          margin: 10,
          textAlign: 'center',
        }}>
        {userLevel === 0 ? `${i18n.t('notUpgraded')}` : `${i18n.t('upgraded')}`}
      </Text>

      {!result ? (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
            width: Dimensions.get('window').width / 1.1,
          }}>
          <Text>attempt {count} of 5</Text>
          <LinearProgress style={{ marginVertical: 10 }} />
        </View>
      ) : (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              margin: 10,
              textAlign: 'center',
            }}>
            {result}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              //alignItems: 'center',
              margin: 10,
              width: Dimensions.get('window').width / 1.1,
            }}>
            <Button
              onPress={() => {
                Linking.openURL('https://t.me/fitlinezsupport');
              }}
              title={`${i18n.t('support')}`}
              titleStyle={{ color: theme.colors.white }}
              containerStyle={{ margin: 10 }}
              buttonStyle={{
                backgroundColor: theme.colors.button,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 16,
                width: Dimensions.get('window').width / 2.4,
              }}
            />

            <Button
              onPress={() => {
                navigator.reset({
                  index: 0,
                  routes: [{ name: 'Home' }],
                });
              }}
              title={`${i18n.t('home')}`}
              titleStyle={{ color: theme.colors.white }}
              containerStyle={{ margin: 10 }}
              buttonStyle={{
                backgroundColor: theme.colors.button,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 16,
                width: Dimensions.get('window').width / 2.4,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default ConfirmPayment;
