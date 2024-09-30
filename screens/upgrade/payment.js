import React, { useContext, useEffect, useState } from 'react';
import { userLevelCheck } from '../../api/GetData';
import AuthContext from '../../api/context';
import { Button, Text, useTheme } from '@rneui/themed';
import { Dimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AnimatedLottieView from 'lottie-react-native';

function ConfirmPayment() {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const [result, setResult] = useState(null);
  const userLevel = userAuth.level;
  const navigator = useNavigation();
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('loading');
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
      {status === 'success' && (
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              margin: 10,
              textAlign: 'center',
              fontFamily: 'Vazirmatn',
            }}>
            تبریک
          </Text>
          <AnimatedLottieView
            source={require('../../assets/success.json')}
            autoPlay
            style={{
              width: 300,
              height: 300,
              alignSelf: 'center',
            }}></AnimatedLottieView>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              margin: 10,
              textAlign: 'center',
              fontFamily: 'Vazirmatn',
            }}>
            حساب کاربری پریمیوم شما فعال شد
          </Text>
          <Button
            onPress={() =>
              navigator.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              })
            }
            buttonStyle={{
              backgroundColor: theme.colors.button,
              width: Dimensions.get('window').width / 1.1,
              borderRadius: 8,
              marginHorizontal: 20,
            }}
            titleStyle={{ fontFamily: 'Vazirmatn' }}
            title="شروع مسیر"
          />
        </View>
      )}
      {status === 'loading' && (
        <View>
          <Text
            style={{
              fontSize: 16,
              // fontWeight: '700',
              margin: 10,
              textAlign: 'center',
              fontFamily: 'Vazirmatn',
            }}>
            در حال پردازش پرداخت
          </Text>
          <Text
            style={{
              fontSize: 16,
              // fontWeight: '700',
              margin: 10,
              textAlign: 'center',
              fontFamily: 'Vazirmatn',
            }}>
            در صورتی که پرداخت موفقیت آمیز باشد، یک ایمیل دریافت خواهید کرد
          </Text>
          <AnimatedLottieView
            source={require('../../assets/LoadingText.json')}
            autoPlay
            style={{
              width: 300,
              height: 300,
              alignSelf: 'center',
            }}></AnimatedLottieView>
          <Text
            style={{
              fontSize: 16,
              //  fontWeight: '700',
              margin: 10,
              textAlign: 'center',
              fontFamily: 'Vazirmatn',
            }}>
            بعد از دریافت ایمیل، روی دکمه زیر بزنید
          </Text>
          <Button
            onPress={() => navigator.navigate('WorkoutListIndex')}
            buttonStyle={{
              backgroundColor: theme.colors.button,
              width: Dimensions.get('window').width / 1.1,
              borderRadius: 8,
              marginHorizontal: 20,
            }}
            titleStyle={{ fontFamily: 'Vazirmatn' }}
            title="شروع مسیر"
          />
        </View>
      )}
    </View>
  );
}

export default ConfirmPayment;
