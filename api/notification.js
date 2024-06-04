import * as Notifications from 'expo-notifications';

// Request permissions for notifications
async function requestPermissions() {
  console.log('Requesting permissions for notifications');
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  console.log('Existing status:', existingStatus);

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return false;
  }

  return true;
}

// Schedule a push notification
async function schedulePushNotification({ title, body, data }) {
  const permissionGranted = await requestPermissions();
  if (!permissionGranted) return;

  console.log('Scheduling notification:', title, body, data);

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
    },
    trigger: { seconds: 1 }, // Change the trigger time as needed
  });
}

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export { schedulePushNotification };
