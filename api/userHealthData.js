import AppleHealthKit from 'react-native-health';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

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

  // iOS - HealthKit
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log('Error checking availability');
        return;
      }
      if (!isAvailable) {
        console.log('Apple Health not available');
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log('Error getting permissions');
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    const options = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps');
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getFlightsClimbed(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      setFlights(results.value);
    });

    AppleHealthKit.getDistanceWalkingRunning(options, (err, results) => {
      if (err) {
        console.log('Error getting the steps:', err);
        return;
      }
      setDistance(results.value);
    });

    // Fixing Active Energy Burned
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 of the current day

    const endDate = new Date(date); // Current time of the day

    AppleHealthKit.getActiveEnergyBurned(
      {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      (err, results) => {
        if (err) {
          console.log('Error getting the active energy:', err);
          return;
        }

        // Log results to see the records array
        console.log('Active Energy Results:', results);

        // Sum up the value fields from the array of results
        const totalActiveEnergy = results.reduce(
          (sum, record) => sum + record.value,
          0
        );

        setActiveEnergy(totalActiveEnergy);
        console.log('Total Active Energy Burned:', totalActiveEnergy);
      }
    );
  }, [hasPermissions, date]);

  return {
    steps,
    flights,
    distance,
    activeEnergy,
    hasPermissions,
  };
};

export default useHealthData;
