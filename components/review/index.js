import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';

const review = async () => {
  const itunesItemId = 6443489365;
  const androidPackageName = 'eu.fitlinez.eu';
  await AsyncStorage.setItem('userReview', 'true');
  if (Platform.OS === 'ios') {
    // Open the iOS App Store in the browser -> redirects to App Store on iOS
    Linking.openURL(
      `https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`
    );
    // Open the iOS App Store directly
    Linking.openURL(
      `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
    );
  } else {
    // Open the Android Play Store in the browser -> redirects to Play Store on Android
    Linking.openURL(
      `https://play.google.com/store/apps/details?id=${androidPackageName}&showAllReviews=true`
    );
    // Open the Android Play Store directly
    Linking.openURL(
      `market://details?id=${androidPackageName}&showAllReviews=true`
    );
  }
};

export default review;
