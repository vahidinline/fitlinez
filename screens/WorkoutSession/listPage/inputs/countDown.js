import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  IconPause,
  IconPlay,
  IconReset,
  IconSave,
} from '../../../../screens/marketplace/filters/icons';
import formatTime from '../../../../api/timeFormat';

const CountDown = ({ setStopwatchTime, handleInputChange }) => {
  // State and refs to manage time and stopwatch status
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(0);
  // Function to start the stopwatch

  const handleStop = () => {
    console.log('handleStop');
    clearInterval(intervalRef.current);
    handleInputChange();
    setRunning(false);
  };
  const startStopwatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setStopwatchTime(time);
    setRunning(true);
  };
  // Function to pause the stopwatch
  const pauseStopwatch = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setStopwatchTime(time);
  };
  // Function to reset the stopwatch
  const resetStopwatch = () => {
    clearInterval(intervalRef.current);
    setTime(0);
    setRunning(false);
  };
  // Function to resume the stopwatch
  const resumeStopwatch = () => {
    startTimeRef.current = Date.now() - time * 1000;
    intervalRef.current = setInterval(() => {
      setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);
    setStopwatchTime(time);
    setRunning(true);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {running && (
          <TouchableOpacity style={styles.pauseButton} onPress={pauseStopwatch}>
            <IconPause />
          </TouchableOpacity>
        )}
        {!running && (
          <TouchableOpacity style={styles.saveButton} onPress={handleStop}>
            <IconSave />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.timeText}>{formatTime(time)}</Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {!running && (
          <TouchableOpacity style={styles.startButton} onPress={startStopwatch}>
            <IconPlay />
          </TouchableOpacity>
        )}

        {running && (
          <TouchableOpacity style={styles.resetButton} onPress={resetStopwatch}>
            <IconReset />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    borderRadius: 14,
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    height: 50,
  },

  timeText: {
    fontSize: 20,
    color: '#5B5891',
    // top: 10,
  },

  startButton: {
    position: 'absolute',
    right: 0,
    //  left: Dimensions.get('window').width / 4,
  },
  resetButton: {
    position: 'absolute',
    right: 0,
  },
  pauseButton: {
    position: 'absolute',
    left: 0,
  },
  resumeButton: {
    position: 'absolute',
    right: 0,
  },
  saveButton: {
    marginRight: 10,
    position: 'absolute',
    left: 0,
  },

  button: {
    backgroundColor: 'red',
    height: '100%',
    position: 'absolute',
    right: Dimensions.get('window').width / 4,
    bottom: 0,
  },
});

export default CountDown;
