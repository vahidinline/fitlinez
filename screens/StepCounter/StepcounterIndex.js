import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useTheme } from '@rneui/themed';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { IconWalking } from '../marketplace/filters/icons';
import convertToPersianNumbers from '../../api/PersianNumber';
import WeeklyStepChart from './weeklyChart';

export default function StepcounterIndex() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  useEffect(() => {
    let subscription;

    const setupSubscription = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        // Set `end` to the current date and time
        const end = new Date();

        // Set `start` to 00:00:00 of today
        const start = new Date();
        start.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

        // Get the step count from the start of today until now
        const pastStepCountResult = await Pedometer.getStepCountAsync(
          start,
          end
        );
        if (pastStepCountResult) {
          setPastStepCount(pastStepCountResult.steps);
        }

        // Start watching step count from now
        subscription = Pedometer.watchStepCount((result) => {
          setCurrentStepCount(result.steps);
        });
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {isPedometerAvailable === 'true' ? (
        <View
          style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <IconWalking color={theme.colors.secondary} size={64} />
            </View>
            <View>
              <Text style={styles.text}>{i18n.t('stepsTakenToday')} </Text>
              <Text style={styles.steps}>
                {convertToPersianNumbers(pastStepCount + currentStepCount, RTL)}
              </Text>
            </View>
          </View>
          <WeeklyStepChart theme={theme} RTL={RTL} i18n={i18n} />
        </View>
      ) : (
        <Text style={styles.text}>{i18n.t('stepCounterNotAvailable')}</Text>
      )}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      top: 25,
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
