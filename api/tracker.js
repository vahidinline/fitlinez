import { init, logEvent } from '@amplitude/analytics-react-native';

const trackUserData = async (user, event) => {
  const { email } = user;

  // wherever you want to log an event
  logEvent(event);
  const setupAmplitude = async () => {
    await init('2dbde109138c224a29c59085770205c', email, {
      useNativeDeviceInfo: true,
      platform: 'mobile',
    });
  };

  setupAmplitude();
};

export { trackUserData };
