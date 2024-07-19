import { NativeModules } from 'react-native';

const BackgroundTimer = NativeModules.BackgroundTimer;

export const startBackgroundTimer = (interval, callback) => {
  BackgroundTimer.start(interval);
  const intervalId = BackgroundTimer.setInterval(callback, interval);
  return intervalId;
};

export const stopBackgroundTimer = (intervalId) => {
  BackgroundTimer.clearInterval(intervalId);
  BackgroundTimer.stop();
};
