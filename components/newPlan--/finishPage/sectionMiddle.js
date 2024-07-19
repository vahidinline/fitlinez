import { View, Animated, Image, PanResponder } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';
import { Text } from '@rneui/themed';
import Duration from '../../../assets/duration.png';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { useContext, useRef } from 'react';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import { get } from 'lodash';
import { getStyle } from 'victory-core/lib/victory-util/wrapper';

const MiddleSection = (props) => {
  const { theme } = useTheme();
  const styles = getStyle(theme);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  const { timeSpent, color, totalWeightSum, hideWeight, newRecord } = props;
  //console.log('newRecord', newRecord);
  //console.log('totalWeightSum', totalWeightSum);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <View
      onLayout={onLayoutRootView}
      style={{
        padding: 10,
        marginBottom: 10,
        borderRadius: 10,
        direction: userLanguage === 'fa' ? 'rtl' : 'ltr', // Set 'rtl' direction when userLanguage is 'fa'
      }}>
      {newRecord?.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            // backgroundColor: '#000',

            padding: 10,
            borderRadius: 10,
          }}>
          {/* {newRecord?.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  // backgroundColor: '#000',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LottieView
                  source={require('../../../assets/medal.json')}
                  autoPlay
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'transparent',
                  }}
                />
              </View>
            );
          })} */}
        </View>
      ) : (
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            paddingLeft: 10,
            textAlign: 'center',
            //padding: 10,
          }}>
          {i18n.t('keepGoing')}
        </Text>
      )}

      <View
        style={{
          flexDirection: 'column',
          padding: 10,
          marginTop: 20,
          borderRadius: 10,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',

          direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
        }}>
        <Image
          source={Duration}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
          }}
        />
        <Text
          style={{
            color,
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'Orbitron',
            color: '#fff',
          }}>
          {formatTime(timeSpent)}
        </Text>
      </View>

      {totalWeightSum !== 0 && (
        <View
          style={{
            flexDirection: 'column',
            padding: 10,
            marginTop: 20,
            borderRadius: 10,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
          }}>
          <Text style={styles.title}>
            {i18n.t('liftedweight')} : {totalWeightSum} {i18n.t('kg')}
          </Text>
        </View>
      )}
    </View>
  );
};

export default MiddleSection;

const styles = (styles) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBox: {
      padding: 10,
      textAlign: 'center',
      borderRadius: 5,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.seconds,
    },
  });
