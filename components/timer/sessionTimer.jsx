import React, { useContext, useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import { useTheme } from '@rneui/themed';
const SessionTimer = ({ stoptimer }) => {
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
      style={{
        flexDirection: 'row',
      }}>
      <Icon
        name="timer"
        type="material"
        color={theme.colors.secondary}
        size={15}
        style={{ marginTop: 5 }}
      />
      <Text
        style={{
          textAlign: 'center',
          margin: 5,
          color: theme.colors.secondary,
          fontSize: 15,
        }}>
        {formatTime(timeSpentLocal)}
      </Text>
    </View>
  );
};

export default SessionTimer;
