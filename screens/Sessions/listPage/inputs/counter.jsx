import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Button, Overlay, useTheme } from '@rneui/themed';
import { Audio } from 'expo-av';
import convertToPersianNumbers from '../../../../api/PersianNumber';

const BACKGROUND_TASK_NAME = 'BACKGROUND_COUNTER_TASK';

TaskManager.defineTask(BACKGROUND_TASK_NAME, () => {
  try {
    // Retrieve the current count, decrement, and save it
    // This is a simplified version; you'll need to handle the timer logic
    AsyncStorage.getItem('count').then((storedCount) => {
      let newCount = (parseInt(storedCount, 10) || 0) - 1;
      AsyncStorage.setItem('count', newCount.toString());
    });

    return BackgroundFetch.Result.NewData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
});

const RestCounterComponent = ({ setVisible, visible, buttonTitle, RTL }) => {
  // console.log('visible in RestCounter', visible);
  const [count, setCount] = useState(60);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState();
  const { theme } = useTheme();
  useEffect(() => {
    registerBackgroundTask();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Load the sound
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../../assets/beep.mp3') // Replace with the path to your sound file
      );
      setSound(sound);
    };

    loadSound();

    return () => {
      // Unload the sound when the component is unmounted
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('count', count.toString());
  }, [count]);

  const registerBackgroundTask = async () => {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
      minimumInterval: 60, // Minimum interval in seconds
    });
  };

  const handleAppStateChange = async (nextAppState) => {
    if (nextAppState === 'active') {
      const storedCount = await AsyncStorage.getItem('count');
      setCount(parseInt(storedCount, 10) || 0);
    }
  };

  useEffect(() => {
    if (count === 5) {
      playSound();
    }
  }, [count]);

  useEffect(() => {
    if (count === 0) {
      setVisible(false);
    }
  }, [count]);

  const playSound = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  const onTimerUpdate = (remainingTime) => {
    setCount(remainingTime);
  };

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={() => setVisible(false)}
      overlayStyle={{
        opacity: 1,
        width: '80%',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        //transparent: true,
        //borderRadius: 20,
        backgroundColor: theme.colors.background,
        shadowColor: 'transparent',
      }}>
      <CountdownCircleTimer
        isPlaying={isPlaying}
        duration={60}
        size={80}
        strokeWidth={8}
        initialRemainingTime={count}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[10, 6, 3, 0]}
        onComplete={() => ({ shouldRepeat: true, delay: 2 })}
        updateInterval={1}
        onUpdate={onTimerUpdate}>
        {({ remainingTime, color }) => (
          <Text
            style={{
              color,
              fontSize: 20,
              fontWeight: '500',
              fontFamily: 'Vazirmatn',
            }}>
            {convertToPersianNumbers(remainingTime, RTL)}
          </Text>
        )}
      </CountdownCircleTimer>
      <Button
        containerStyle={{
          borderRadius: 12,
          height: 50,
          marginTop: 15,
          width: '100%',
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
        color={theme.colors.background}
        onPress={() => setVisible(false)}>
        <Text
          style={{
            color: theme.colors.secondary,
            fontSize: 16,
            fontWeight: '500',
            top: 4,
            fontFamily: 'Vazirmatn',
          }}>
          {buttonTitle}
        </Text>
      </Button>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 8,
    height: 180,
  },
});

export default RestCounterComponent;
