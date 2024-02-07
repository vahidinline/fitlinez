import { Linking, Platform, View } from 'react-native';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

const AppReview = () => {
  const navigation = useNavigation();
  const review = () => {
    if (Platform.OS === 'ios') {
      const itunesItemId = 6443489365;
      // Open the iOS App Store in the browser -> redirects to App Store on iOS
      Linking.openURL(
        `https://apps.apple.com/app/apple-store/id${itunesItemId}?action=write-review`
      );
      // Open the iOS App Store directly
      Linking.openURL(
        `itms-apps://itunes.apple.com/app/viewContentsUserReviews/id${itunesItemId}?action=write-review`
      );
    } else {
      const androidPackageName = 'eu.fitlinez.eu';
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
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Button title="Rate App" onPress={review} />
      <Button title="back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default AppReview;
