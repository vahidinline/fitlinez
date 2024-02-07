import { Text, useTheme } from '@rneui/themed';
import React, { useContext, useCallback } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import AuthContext from '../../api/context';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useNavigation } from '@react-navigation/native';
import { Chip } from 'react-native-paper';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useFocusEffect } from '@react-navigation/native';

import {
  IconHeaderNotStarted,
  IconStarted,
} from '../marketplace/filters/icons';
import {
  checkVersion,
  userLevelCheck,
  userStatusCheck,
} from '../../api/GetData';
import { useState } from 'react';
import UserPrivilegeContext from '../../api/userPrivilegeContext';
import { generateHeaderText } from '../../api/readWorkoutData';

function HomeHeader({ planStartDate, data, title }) {
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [textMessage, setTextMessage] = useState('');
  const [activeAccount, setActiveAccount] = useState(true);
  const [status, setStatus] = useState('good');
  const currentVersion = '7.0.7.2';
  const userLocation = userAuth.location;
  const userLevel = userAuth.level;
  const Userplatform = Platform.OS;
  const { userPrivilege } = useContext(UserPrivilegeContext);

  useEffect(() => {
    const res = generateHeaderText(planStartDate, data, i18n, title);
    activeAccount && setTextMessage(res.message);
    setStatus(res.status);
  }, [planStartDate, data, i18n, title]);
  //console.log('userPervilage in header', userPervilage);
  const BACKGROUND_FETCH_TASK = 'background-fetch';

  const checkUserPervilage = () => {
    if (userLevel === 4) {
      //setTextMessage('1message.message');
      console.log('user is premium');
    } else if (userPrivilege) {
      // setTextMessage('2');
      console.log('user is free with valid days');
    } else {
      // condition 2
      setTextMessage(`${i18n.t('trialExpired')}`);
      setActiveAccount(false);
    }
  };

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      await syncMessages();
      return BackgroundFetch.Result.NewData;
    } catch (err) {
      return BackgroundFetch.Result.Failed;
    }
  });

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only
      startOnBoot: true, // android only
    });
  }

  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      userLevelCheck(userAuth, setUserAuth);
      userStatusCheck(userAuth, setUserAuth);
      checkVersion(currentVersion, Userplatform, userLocation);
      checkUserPervilage();
      checkFirstTimeUser();
      return () => {
        // alert('Screen was unfocused');
      };
    }, [])
  );

  const messageLength = textMessage.length;

  const navigation = useNavigation();
  const RTL = userLanguage === 'fa';
  const checkFirstTimeUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@firstUsage');
      if (value === null) {
        // First time user, set a flag in AsyncStorage
        await AsyncStorage.setItem('@firstUsage', 'true');
        navigation.navigate('IndexOnBoarding');
        console.log('first time');
      } else {
        // Returning user, set the flag to false
        await AsyncStorage.setItem('@firstUsage', 'false');
        console.log('not first time');
      }
    } catch (error) {
      // Handle AsyncStorage errors if needed
    }
  };

  useEffect(() => {
    checkFirstTimeUser();
    //AsyncStorage.removeItem('@firstUsage');
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 80,
        alignItems: 'center',
      }}>
      <View>
        <View>
          <Text
            style={{
              fontSize: 22,
              color: theme.colors.secondary,
              marginHorizontal: 10,
              marginBottom: 5,
              textAlign: RTL ? 'right' : 'left',
            }}>
            {i18n.t('welcome')} {''}
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: theme.colors.secondary,
              }}>
              {userAuth?.name}!
            </Text>
          </Text>
        </View>
        <Chip
          style={{
            backgroundColor:
              status === 'bad' && !activeAccount
                ? theme.colors.warning
                : theme.colors.lightPrimary,
            marginHorizontal: 10,
            marginTop: 5,
            height: 50,
            padding: 5,
            width: Dimensions.get('window').width - 20,
            //direction: RTL ? 'rtl' : 'ltr',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              top: 0,
              justifyContent: 'space-between',
              alignItems: 'center',
              // backgroundColor: { backgroundColor },

              width: '100%',
            }}>
            <Text
              onPress={() => !activeAccount && navigation.navigate('Upgrade')}
              style={{
                color: theme.colors.secondary,
                fontSize: messageLength > 50 ? 12 : 14,
                //paddingHorizontal: 10,
                flexWrap: 'wrap',
                flex: 1,
                fontWeight: '400',
                marginHorizontal: 5,
                //direction: RTL ? 'rtl' : 'ltr',
                textAlign: RTL ? 'right' : 'left',
              }}>
              {textMessage}
            </Text>
            {activeAccount && (
              <>
                {status === 'bad' ? <IconHeaderNotStarted /> : <IconStarted />}
              </>
            )}
          </View>
        </Chip>

        {/* <Greeting /> */}
      </View>
    </View>
  );
}

export default HomeHeader;
