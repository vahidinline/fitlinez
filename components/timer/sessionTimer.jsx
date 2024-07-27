import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import { useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import convertToPersianNumbers from '../../api/PersianNumber';
const SessionTimer = ({ stoptimer, saveTimer, setSaveTimer, RTL }) => {
  const [timeSpentLocal, setTimeSpentLocal] = useState(0);
  const { timeSpent, setTimeSpent } = useContext(TimeSpentContext);

  const { theme } = useTheme();
  useEffect(() => {
    const startTime = new Date().getTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTime = Math.floor((currentTime - startTime) / 1000);
      setTimeSpentLocal(elapsedTime);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (stoptimer) {
      setTimeSpent(timeSpentLocal);
    }
  }, [stoptimer]);

  useEffect(() => {
    if (saveTimer) {
      storeTimeSpend(timeSpentLocal);
      setTimeSpent(timeSpentLocal);
      setSaveTimer(!saveTimer);
    }
  }, [saveTimer]);

  const storeTimeSpend = async (timeSpentLocal) => {
    try {
      await AsyncStorage.setItem('@time_spend', JSON.stringify(timeSpentLocal));
      console.log('time_spend stored', JSON.stringify(timeSpentLocal));
    } catch (error) {
      console.error('Error saving time spend', error);
    }
  };

  //trigger storeTimeSpend after each minute
  useEffect(() => {
    const interval = setInterval(() => {
      storeTimeSpend(timeSpentLocal);
      console.log('time_spend interval stored', JSON.stringify(timeSpentLocal));
    }, 60000);
    return () => clearInterval(interval);
  }, [timeSpentLocal]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${convertToPersianNumbers(
      formattedHours,
      RTL
    )}:${convertToPersianNumbers(
      formattedMinutes,
      RTL
    )}:${convertToPersianNumbers(formattedSeconds, RTL)}`;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      {/* <Icon
        name="timer"
        type="material"
        color={theme.colors.secondary}
        size={15}
        style={{ marginTop: 5 }}
      /> */}
      <Text
        style={{
          textAlign: 'center',
          margin: 5,
          color: theme.colors.secondary,
          fontSize: 18,
          fontFamily: 'Vazirmatn',
        }}>
        {formatTime(timeSpentLocal)}
      </Text>
    </View>
  );
};

export default SessionTimer;
