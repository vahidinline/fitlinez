import { useState, useEffect, useContext } from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useTheme } from '@rneui/themed';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { IconWalking } from '../marketplace/filters/icons';
import convertToPersianNumbers from '../../api/PersianNumber';

import AsyncStorage from '@react-native-async-storage/async-storage';
import useHealthData from '../../api/userHealthData';
import { useNavigation } from '@react-navigation/native';

export default function StepcounterIndex() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');

  const [status, setStatus] = useState('idle');
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const STEPS_GOAL = 10_000;
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const { steps, flights, distance, activeEnergy, hasPermissions } =
    useHealthData(date);

  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [stepsPedo, setStepsPedo] = useState(0);
  //console.log('activeEnergy', activeEnergy);
  useEffect(() => {
    setStepsPedo(pastStepCount + currentStepCount);
  }, [pastStepCount, currentStepCount]);

  useEffect(() => {
    let subscription;

    const setupSubscription = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const end = new Date();
        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const pastStepCountResult = await Pedometer.getStepCountAsync(
          start,
          end
        );
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps);
        }

        subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);
        });
      } else {
        setStatus('error');
      }
    };

    setupSubscription();

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        {
          height: status !== 'error' ? Dimensions.get('window').height / 2 : 50,
        },
      ]}>
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
            onPress={() => navigation.navigate('StepCounter')}>
            <IconWalking color={theme.colors.secondary} size={64} />

            <View
              style={{
                flexDirection: 'column',
                width: '50%',
                direction: RTL ? 'rtl' : 'ltr',

                alignItems: 'center',
              }}>
              <Text style={styles.text}>{i18n.t('stepsTakenToday')} </Text>
              <Text style={styles.steps}>
                {convertToPersianNumbers(stepsPedo, RTL)}
              </Text>
              {hasPermissions && (
                <Text style={styles.text}>
                  {i18n.t('walkingDistance', {
                    distance: convertToPersianNumbers(
                      (distance / 1000).toFixed(2),
                      RTL
                    ),
                  })}
                </Text>
              )}
              <Text style={styles.text}>
                {i18n.t('activeEnergyBurned')} :
                {convertToPersianNumbers(activeEnergy.toFixed(0), RTL)}{' '}
                {i18n.t('kcal')}
              </Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.text}>{i18n.t('stepCounterNotAvailable')}</Text>
      )}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      top: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    steps: {
      color: theme.colors.white,
      fontSize: 40,
      fontFamily: 'Vazirmatn',
    },
    text: {
      color: theme.colors.white,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
    },
  });
