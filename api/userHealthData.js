import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AppleHealthKit from 'react-native-health';
import { Pedometer } from 'expo-sensors';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.Steps,
      AppleHealthKit.Constants.Permissions.FlightsClimbed,
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
    ],
    write: [],
  },
};

const useHealthData = (date) => {
  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [flights, setFlights] = useState(0);
  const [distance, setDistance] = useState(0);

  const [activeEnergy, setActiveEnergy] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [stepsPedo, setStepsPedo] = useState(0);

  // Combine past and current step count for Pedometer
  useEffect(() => {
    setStepsPedo(pastStepCount + currentStepCount);
  }, [pastStepCount, currentStepCount]);

  // Setup Pedometer (cross-platform steps tracking)
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
        console.log('Pedometer not available');
      }
    };

    setupSubscription();

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, []);

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err || !isAvailable) {
        console.log('Apple Health not available or error occurred:', err);
        return;
      }

      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error initializing HealthKit permissions:', err);
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  // Fetch health data including heart rate and others
  useEffect(() => {
    const fetchHealthData = () => {
      if (!hasPermissions) return;

      const options = {
        date: date.toISOString(),
        includeManuallyAdded: false,
      };

      AppleHealthKit.getStepCount(options, (err, results) => {
        setSteps(err ? stepsPedo : results.value);
      });

      AppleHealthKit.getFlightsClimbed(options, (err, results) => {
        if (err) console.log('Error fetching flights:', err);
        else setFlights(results.value);
      });

      // AppleHealthKit.getHeartRateSamples(
      //   {
      //     unit: 'bpm',
      //     startDate: new Date(
      //       new Date().setHours(new Date().getHours() - 1)
      //     ).toISOString(), // Last hour
      //     endDate: new Date().toISOString(),
      //     ascending: false,
      //     limit: 1, // Only get the most recent heart rate
      //   },
      //   (err, results) => {
      //     if (err) console.log('Error fetching heart rate:', err);
      //     else if (results && results.length > 0)
      //       setHeartRate(results[0].value);
      //   }
      // );

      AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
        if (err) console.log('Error fetching distance:', err);
        else setDistance(results.value);
      });

      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0); // Midnight

      const endDate = new Date(date);

      AppleHealthKit.getActiveEnergyBurned(
        { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
        (err, results) => {
          if (err) {
            console.log('Error fetching active energy:', err);
            return;
          }

          const totalActiveEnergy = results.reduce(
            (sum, record) => sum + record.value,
            0
          );
          setActiveEnergy(totalActiveEnergy);
        }
      );
    };

    fetchHealthData();

    // Fetch heart rate dynamically every 5 seconds
    const intervalId = setInterval(fetchHealthData, 100);

    return () => clearInterval(intervalId);
  }, [hasPermissions, date, stepsPedo]);

  return {
    steps,
    flights,
    distance,
    activeEnergy,
    hasPermissions,

    setHasPermission,
  };
};

export default useHealthData;
