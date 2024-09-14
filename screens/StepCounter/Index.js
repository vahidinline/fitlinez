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
import { ButtonGroup } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/header';
import useHealthData from '../../api/userHealthData';

export default function StepCounterMain() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [status, setStatus] = useState('idle');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [stepsPedo, setStepsPedo] = useState(0);
  const [date, setDate] = useState(new Date());
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { steps, flights, distance, activeEnergy, hasPermissions } =
    useHealthData(date);
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
                direction: RTL ? 'rtl' : 'ltr',
              }}>
              <View style={styles.cards}>
                <View>
                  <IconWalking color={theme.colors.secondary} size={64} />
                </View>
                <View
                  style={{
                    flexDirection: 'column',
                  }}>
                  <Text style={styles.text}>{i18n.t('stepsTakenToday')} </Text>
                  <Text style={styles.steps}>
                    {convertToPersianNumbers(stepsPedo, RTL)}
                  </Text>
                </View>
              </View>

              <View style={styles.cards}>
                <Text style={styles.text}>
                  {convertToPersianNumbers(activeEnergy.toFixed(0), RTL)}{' '}
                  {i18n.t('kcal')}
                </Text>
                <Text style={styles.text}>{i18n.t('activeEnergyBurned')}</Text>
              </View>
              <View style={styles.cards}>
                <Text style={styles.text}>
                  {convertToPersianNumbers((distance / 1000).toFixed(2), RTL)}{' '}
                  {i18n.t('km')}
                </Text>
                <Text style={styles.text}>
                  {i18n.t('walkingDistancesingle')}
                </Text>
              </View>
              {/* <ButtonGroup
                buttons={['Weekly', 'Monthly', 'yearly']}
                selectedIndex={selectedIndex}
                onPress={(value) => {
                  setSelectedIndex(value);
                }}
                containerStyle={{ marginBottom: 20 }}
              /> */}
              <WeeklyStepChart
                theme={theme}
                RTL={RTL}
                i18n={i18n}
                // duration={365}
              />
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

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      top: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.backgroundColor,
      width: Dimensions.get('window').width / 1.1,
      marginHorizontal: 20,
    },
    cards: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderColor: theme.colors.border,
      borderWidth: 1,
      borderRadius: 8,
      width: Dimensions.get('window').width / 1.2,
      padding: 10,
      marginVertical: 5,
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
