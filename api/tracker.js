import { init, logEvent } from '@amplitude/analytics-react-native';

const trackUserData = async (user, event) => {
  //console.log('user', user);
  const { email } = user;
  //console.log('email', email);
  // wherever you want to log an event
  logEvent(event);
  const setupAmplitude = async () => {
    await init('2dbde109138c224a29c59085770205c', email ? email : 'anonymous', {
      useNativeDeviceInfo: true,
      platform: 'mobile',
    });
  };

  setupAmplitude();
};

export { trackUserData };
