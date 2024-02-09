import React from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  Share,
  View,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import UserImagePicker from '../../components/userData/userImage';
import { useState } from 'react';
import { ListItem, Text, ThemeContext, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import { List } from 'react-native-paper';
import AuthContext from '../../api/context';
import i18nt from '../../locales';
import * as Notifications from 'expo-notifications';
import {
  IconArrow,
  IconClear,
  IconInfo,
  IconLanguage,
  IconNotification,
  IconRanking,
  IconSupport,
  IconTrash,
  Iconshare,
} from '../marketplace/filters/icons';

const message =
  //'https://fitlinez.com/application?utm_source=fitlinezApp&utm_medium=share&utm_campaign=sharetoFriendWithInApp';
  Platform.OS === 'ios'
    ? 'https://apps.apple.com/ee/app/fitlinez/id6443489365'
    : 'https://play.google.com/store/apps/details?id=e.fitlinez.eu&hl=en&gl=EE';
const onShare = async () => {
  try {
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    Alert.alert(error.message);
  }
};

const deleteAccount = () => {
  Alert.alert(
    'Delete Account  ',
    'Are you sure you want to Delete your account?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          Alert.alert(
            'Account Deletion request has been recieved. Your account will be removed within 2 business days'
          ) + console.log(userAuth.id),
      },
    ],
    { cancelable: false }
  );
};

function SettingIndex() {
  const key = 'fitlinez-session';
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { toggleTheme } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState(null);
  const { theme } = useTheme();
  const RTL = userLanguage === 'fa' ? true : false;
  const setting = [
    {
      id: 1,
      name: i18n.t('changeLanguage'),
      icon: IconLanguage,
      func: () => navigation.navigate('ChangeLanguage'),
    },
    {
      id: 2,
      name: i18n.t('shareApp'),
      icon: Iconshare,
      func: () => onShare(),
    },
    {
      id: 3,
      name: i18n.t('support'),
      icon: IconSupport,
      func: () => {
        navigation.navigate('SupportIndex');
      },
    },
    // {
    //   id: 4,
    //   name: i18n.t('clearcash'),
    //   icon: IconClear,
    //   func: () => clearAsyncStorage(),
    // },
    {
      id: 7,
      name: i18n.t('rateApp'),
      icon: IconRanking,
      func: () => review(),
    },
    {
      id: 6,
      name: i18n.t('requestDeleteAccount'),
      icon: IconTrash,
      func: () => deleteAccount(),
    },
    {
      id: 9,
      name: i18n.t('pushNotification'),
      icon: IconInfo,
      func: () => registerForPushNotificationsAsync(),
      sub: true,
    },
  ];

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need notification permissions to make this work!');
    } else {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      Alert.alert('Push Notification has been enabled');
    }
  }

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 0,
          marginHorizontal: 10,
          direction: RTL ? 'rtl' : 'ltr',
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '500',
            color: theme.colors.secondary,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            left: Dimensions.get('window').width / 2.5,
          }}>
          {i18n.t('settings')}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: 90,
          marginBottom: 0,
          marginHorizontal: 10,
          //backgroundColor: theme.colors.red,
          borderRadius: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // marginTop: 20,
            marginBottom: 0,
            marginLeft: 10,
            //borderWidth: 1,
            borderRadius: 10,
            //borderColor: '#5B5891',
            // width: 50,
            // height: 50,
            alignContent: 'center',
            alignItems: 'center',
            //alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            data={setting}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={() => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: item.id !== 5 ? '300' : '500',
                        color: item.id !== 5 ? theme.colors.text : 'red',
                        marginLeft: 10,
                        //position: 'absolute',
                        //right: 180,
                        //top: -10,
                      }}>
                      {item.name}
                    </Text>
                  );
                }}
                onPress={() => item.func()}
                right={(props) => (item.sub ? null : <IconArrow {...props} />)}
                left={(props) => {
                  const Icon = item.icon;
                  return <Icon {...props} />;
                }}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SettingIndex;
