import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Platform,
  SafeAreaView,
  Share,
  TouchableOpacity,
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
import * as Device from 'expo-device';

import {
  IconArrow,
  IconInfo,
  IconLanguage,
  IconRanking,
  IconSupport,
  IconTrash,
  IconWeight,
  Iconshare,
} from '../marketplace/filters/icons';
import { getUsercurrentWorkoutPlan } from '../../api/GetCurrentPlan';

const message =
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

function SettingIndex() {
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [avatar, setAvatar] = useState(null);
  const { theme } = useTheme();
  const RTL = userLanguage === 'fa' ? true : false;

  const notificationListener = useRef();
  const responseListener = useRef();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Failed to get push token for push notification!');
        return null;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      // console.log('Expo push token:', token);
    } else {
      Alert.alert('Must use physical device for Push Notifications');
    }

    return token;
  }

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
    // {
    //   id: 8,
    //   name: i18n.t('updatePlanManually'),
    //   icon: IconWeight,
    //   func: () => getUsercurrentWorkoutPlan(userAuth.id),
    // },
    {
      id: 9,
      name: i18n.t('pushNotification'),
      icon: IconInfo,
      func: () => registerForPushNotificationsAsync(),
      sub: true,
    },
  ];

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

  async function registerForPushNotificationsAsync() {
    const { status } = await Notifications.requestPermissionsAsync();
    // console.log('Notification permissions status:', status);

    if (status !== 'granted') {
      Alert.alert('Sorry, we need notification permissions to make this work!');
    } else {
      try {
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        //  console.log('Expo push token:', token);
        Alert.alert('Push Notification has been enabled');
      } catch (error) {
        console.error('Error getting push token:', error);
      }
    }
  }

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => setValue(token));

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       console.log('Notification received:', notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log('Notification response received:', response);
  //     });

  //   return () => {
  //     Notifications.removeNotificationSubscription(
  //       notificationListener.current
  //     );
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);

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
          marginTop: 40,
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
            fontFamily: 'Vazirmatn',
          }}>
          {i18n.t('settings')}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
          }>
          {/* <IconArrowLeft color={theme.colors.secondary} /> */}
        </TouchableOpacity>
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
                        fontFamily: 'Vazirmatn',
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
