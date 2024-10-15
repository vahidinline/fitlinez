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
import useHealthData from '../../api/userHealthData';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StepcounterIndex() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [stepsGoal, setStepsGoal] = useState(10000);
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
  const {
    steps,
    distance,
    activeEnergy,
    hasPermissions,

    setHasPermission,
  } = useHealthData(date);

  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [stepsPedo, setStepsPedo] = useState(0);

  const retrieveDailyStepsGoal = async () => {
    try {
      const storedValue = await AsyncStorage.getItem('dailyStepsGoal');
      if (storedValue !== null) {
        setStepsGoal(parseInt(storedValue, 10)); // Ensure correct parsing
        console.log('Daily steps goal retrieved:', storedValue);
      } else {
        console.log('No daily steps goal found');
      }
    } catch (e) {
      console.error('Failed to retrieve daily steps goal:', e);
    }
  };

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

  const requestPermissions = async () => {
    const permission = await setHasPermission();

    if (!permission) {
      setStatus('error');
    }
  };

  useEffect(() => {
    retrieveDailyStepsGoal();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          // flex: 1,
          flexDirection: 'column',
          //backgroundColor: theme.colors.warning,

          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 5,
          // marginHorizontal: 0,
        }}
        onPress={() => navigation.navigate('StepCounter')}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            direction: RTL ? 'rtl' : 'ltr',
            alignItems: 'center',
            width: Dimensions.get('window').width / 1.2,
            marginHorizontal: 20,
          }}>
          <View
            style={{
              direction: RTL ? 'rtl' : 'ltr',
              justifyContent: 'space-between',
            }}>
            <IconWalking color={theme.colors.secondary} size={64} />

            {/* {stepsGoal === 0 && (
              <Text style={styles.text}>
                {convertToPersianNumbers(stepsGoal.toFixed(0), RTL)}
              </Text>
            )} */}
          </View>
          <View style={styles.box}>
            <Text style={styles.text}>{i18n.t('stepsTakenToday')} </Text>
            <Text style={styles.steps}>
              {convertToPersianNumbers(steps.toFixed(0), RTL)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            direction: RTL ? 'rtl' : 'ltr',
            alignItems: 'center',
            width: Dimensions.get('window').width / 1.2,
            marginHorizontal: 20,
          }}>
          <View style={styles.box}>
            <Text style={styles.text}>
              {i18n.t('walkingDistance', {
                distance: convertToPersianNumbers(
                  (distance / 1000).toFixed(2),
                  RTL
                ),
              })}
            </Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.text}>
              {i18n.t('activeEnergyBurned')} :
              {convertToPersianNumbers(activeEnergy.toFixed(0), RTL)}{' '}
              {i18n.t('kcal')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      top: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 20,
      width: Dimensions.get('window').width / 1.1,
    },
    steps: {
      color: theme.colors.text,
      fontSize: 40,
      fontFamily: 'Vazirmatn',
    },
    text: {
      color: theme.colors.text,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
    },
    box: {
      justifyContent: 'center',
      width: Dimensions.get('window').width / 2.5,
      height: 80,
      alignContent: 'center',
      alignItems: 'center',
      marginVertical: 4,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
    },
  });
