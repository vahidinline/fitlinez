import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales/index';
import { Icon } from '@rneui/themed';
import AuthContext from '../../api/context';
import AuthStorage from '../../api/storage';
import ShareApp from './share';
import langontext from '../../api/langcontext';
import Header from '../header';
import { Dropdown } from 'react-native-element-dropdown';
import * as SQLite from 'expo-sqlite';
import { ThemeContext } from '../../api/themeContext';
import DatabaseClearer from './cachManager';

const Settings = () => {
  const key = 'fitlinez-session';
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(langontext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { toggleTheme } = useContext(ThemeContext);

  const db = SQLite.openDatabase('userData.db');
  useEffect(() => {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }, [userLanguage]);

  const exitAlert = () => {
    Alert.alert(
      'Exit  ',
      'Are you sure you want to LogOut?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => handleLogOut() },
      ],
      { cancelable: false }
    );
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
  const handleLogOut = () => {
    setUserAuth(null);
    AuthStorage.removeToken();
  };
  const removefromAsync = async () => {
    AsyncStorage.removeItem('userData')
      .then(() => {
        alert('Data Cleared');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Profile' }],
        });
      })

      .catch((e) => {
        alert(e);
      });
  };

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

  const setting = [
    // {
    //   id: 1,
    //   name: i18n.t('changeLanguage'),
    //   icon: 'translate',
    //   func: () => setUserLanguage(userLanguage === 'en' ? 'fa' : 'en'),
    // },
    {
      id: 2,
      name: i18n.t('requestDeleteAccount'),
      icon: 'delete',
      func: () => deleteAccount(),
    },
    {
      id: 3,
      name: i18n.t('rateApp'),
      icon: 'star',
      func: () => review(),
    },
    {
      id: 4,
      name: 'Clear cache',
      icon: 'cleaning-services',
      func: () => clearAsyncStorage(),
    },
    {
      id: 6,
      name: 'Reset Plan',
      icon: 'brush',
      func: () => dropDatabases(),
    },
    {
      id: 5,
      name: i18n.t('logout'),
      icon: 'logout',
      func: () => exitAlert(),
    },
  ];

  const lang = [
    {
      name: 'English',
      code: 'en',
      emoji: '🇺🇸',
      unicode: 'U+1F1FA U+1F1F8',
      image:
        'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/US.svg',
    },
    {
      name: 'Persian',
      code: 'fa',
      emoji: '🇮🇷',
      unicode: 'U+1F1EE U+1F1F7',
      image:
        'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/IR.svg',
    },
    {
      name: 'Estonian',
      code: 'ee',
      emoji: '🇪🇪',
      unicode: 'U+1F1EA U+1F1EA',
      image:
        'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/EE.svg',
    },
    {
      name: 'Germany',
      code: 'de',
      emoji: '🇩🇪',
      unicode: 'U+1F1E9 U+1F1EA',
      image:
        'https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images/DE.svg',
    },
  ];

  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      alert('Cache cleared!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (e) {
      alert('Failed to clear AsyncStorage cache');
    }
  };

  const dropDatabases = () => {
    const db = SQLite.openDatabase('packeges.db');

    db.transaction((tx) => {
      tx.executeSql(
        `DROP TABLE IF EXISTS packeges`,
        [],
        () => {
          alert(`Your plan has been reset`);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        },
        (error) => {
          alert(`Failed to drop database packeges: ${error.message}`);
        }
      );
    });
  };

  return (
    <SafeAreaView>
      <Header title={i18n.t('settings')} />
      <ScrollView style={styles.container}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <Dropdown
            style={[styles.dropdown, isFocus && {}]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={lang}
            search
            maxHeight={300}
            labelField="name"
            valueField="emoji"
            placeholder={!isFocus ? ` ${i18n.t('changeLanguage')}` : '...'}
            searchPlaceholder="Search..."
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setValue(item.name);
              setIsFocus(false);
              setUserLanguage(item.code);
            }}
            renderLeftIcon={() => (
              <Icon
                raised
                name="translate"
                type="material"
                color={isFocus ? 'blue' : 'black'}
                size={20}
              />
            )}
          />
        </View>

        {setting.map((item) => (
          <TouchableOpacity key={item.id} onPress={item.func}>
            <View style={styles.section}>
              <Icon name={item.icon} type="material" color="#3f3b6c" />
              <Text style={styles.title}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
            width: '100%',
          }}>
          {/* <ShareApp /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 0,
  },
  title: {
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#3f3b6c',
    fontWeight: 'bold',
  },
  section: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
    //width: '100%',
    height: 40,
    backgroundColor: '#fff',

    //borderLeftWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    margin: 10,
    // borderWidth: 0.5,
    //borderColor: '#eee',
    width: Dimensions.get('window').width - 20,
  },
  Button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    //backgroundColor: '#3F3B6C',
    padding: 10,
    width: Dimensions.get('window').width - 20,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
  },
  container: {
    //backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    // borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    //backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  inputStyle: {
    fontSize: 16,
    //backgroundColor: '#fff',
    height: 50,
  },
});

export default Settings;
