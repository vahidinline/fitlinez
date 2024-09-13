import { useState, useEffect, useContext } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
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
import WeeklyStepChart from './weeklyChart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header';

export default function StepCounterMain() {
  // const permissions = {
  //   permissions: {
  //     read: [AppleHealthKit.Constants.Permissions.StepCount],
  //     write: [],
  //   },
  // };

  // AppleHealthKit.initHealthKit(permissions, (error) => {
  //   if (error) {
  //     console.log('[ERROR] Cannot grant permissions!', error.message);
  //     return;
  //   }

  //   console.log('HealthKit initialized successfully');
  // });

  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [status, setStatus] = useState('idle');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [steps, setSteps] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [userHeight, setUserHeight] = useState(0);
  const [userGender, setUserGender] = useState('');
  const [userWeight, setUserWeight] = useState(0);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const navigation = useNavigation();

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userBasicData');
      const parsedUserData = JSON.parse(userData); // Parse the JSON data
      setUserHeight(parsedUserData.height * 0.01); // Convert cm to meters
      setUserGender(parsedUserData.gender);
      setUserWeight(parsedUserData.weight);
    } catch (error) {
      setStatus('error');
      console.log('Error fetching user data:', error);
    }
  };

  const calculateCaloriesBurned = (
    steps,
    userGender,
    userHeight,
    userWeight
  ) => {
    if (!steps || !userGender || !userHeight || !userWeight) return 0;

    const stepLengthFactor = userGender === 1 ? 0.415 : 0.413;
    const stepLength = userHeight * stepLengthFactor; // in meters
    const distance = (steps * stepLength) / 1000; // in kilometers
    const speed = 5; // average walking speed in km/h
    const time = distance / speed; // in hours
    const MET = 3.5; // MET for walking
    const caloriesBurned = MET * userWeight * time; // calories burned
    console.log('caloriesBurned', caloriesBurned);
    return caloriesBurned;
  };

  // useEffect(() => {
  //   getUserData();
  // }, []);

  useEffect(() => {
    setSteps(pastStepCount + currentStepCount);
  }, [pastStepCount, currentStepCount]);

  useEffect(() => {
    if (steps && userGender && userHeight && userWeight) {
      calculateCaloriesBurned(steps, userGender, userHeight, userWeight);
    }
  }, [steps, userGender, userHeight, userWeight]);

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
    <SafeAreaView style={styles.container}>
      <Header title={i18n.t('stepcounter')} />
      {Platform.OS === 'ios' ? (
        <>
          {isPedometerAvailable === 'true' ? (
            <View
              // onPress={() => navigation.navigate('StepCounter')}
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <IconWalking color={theme.colors.secondary} size={64} />
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  <Text style={styles.text}>{i18n.t('stepsTakenToday')} </Text>
                  <Text style={styles.steps}>
                    {convertToPersianNumbers(steps, RTL)}
                  </Text>
                </View>
              </View>
              <WeeklyStepChart theme={theme} RTL={RTL} i18n={i18n} />
            </View>
          ) : (
            <Text style={styles.text}>{i18n.t('stepCounterNotAvailable')}</Text>
          )}
        </>
      ) : (
        <Text style={styles.text}>{i18n.t('stepCounterNotAvailable')}</Text>
      )}
    </SafeAreaView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      top: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundColor,
    },
    steps: {
      color: theme.colors.secondary,
      fontSize: 40,
      fontFamily: 'Vazirmatn',
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
    },
  });
