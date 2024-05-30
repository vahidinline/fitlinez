import { Text, useTheme } from '@rneui/themed';
import React, { useContext, useCallback } from 'react';
import { Dimensions, PixelRatio, Platform, View } from 'react-native';
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
} from '../marketplace/filters/icons-';
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
  const currentVersion = '7.0.7.8';
  const userLocation = userAuth.location;
  const userLevel = userAuth.level;
  const Userplatform = Platform.OS;
  const { userPrivilege } = useContext(UserPrivilegeContext);
  const [backgroundColor, setBackgroundColor] = useState(
    theme.colors.lightPrimary
  );
  useEffect(() => {
    const res = generateHeaderText(planStartDate, data, i18n, title);
    activeAccount && setTextMessage(res.message);
  }, [planStartDate, data, i18n, title]);
  const BACKGROUND_FETCH_TASK = 'background-fetch';

  useEffect(() => {
    checkUserPervilage();
  }, [userPrivilege]);

  const checkUserPervilage = () => {
    if (userLevel === 4) {
    } else if (userPrivilege === true) {
      setTextMessage('');
      setBackgroundColor(theme.colors.lightPrimary);
    } else {
      setTextMessage(`${i18n.t('trialExpired')}`);
      setBackgroundColor(theme.colors.warning);
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
      async function fetchData() {
        await userLevelCheck(userAuth, setUserAuth);
        await userStatusCheck(userAuth, setUserAuth);
        await checkVersion(currentVersion, Userplatform, userLocation, i18n);
      }
      fetchData();
      checkFirstTimeUser();
      checkUserPervilage();
    }, [])
  );

  useEffect(() => {
    checkUserPervilage();
  }, []);

  const messageLength = textMessage.length;

  const navigation = useNavigation();
  const RTL = userLanguage === 'fa';
  const checkFirstTimeUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@firstUsage');
      if (value === null) {
        await AsyncStorage.setItem('@firstUsage', 'true');
        navigation.navigate('IndexOnBoarding');
      } else {
        await AsyncStorage.setItem('@firstUsage', 'false');
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  useEffect(() => {
    const getcurrentwotkout = async () => {
      const value = await AsyncStorage.getItem('currentWorkout');

      console.log('current workout', value);
    };

    getcurrentwotkout();
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

          <View
            style={{
              flexDirection: 'row',
              top: 0,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}>
            <Text
              onPress={() => !activeAccount && navigation.navigate('Upgrade')}
              style={{
                color: theme.colors.secondary,
                fontSize: messageLength > 50 || PixelRatio.get() < 3 ? 12 : 14,
                flexWrap: 'wrap',
                flex: 1,
                fontWeight: '400',
                marginHorizontal: 5,
                textAlign: RTL ? 'right' : 'left',
              }}></Text>
          </View>
        </View>

        <Chip
          style={{
            backgroundColor: backgroundColor,
            marginHorizontal: 10,
            marginTop: 5,
            height: 50,
            padding: 5,
            width: Dimensions.get('window').width - 20,
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              top: 0,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '100%',
            }}>
            <Text
              onPress={() => !activeAccount && navigation.navigate('Upgrade')}
              style={{
                color: theme.colors.secondary,
                fontSize: messageLength > 50 || PixelRatio.get() < 3 ? 12 : 14,
                flexWrap: 'wrap',
                flex: 1,
                fontWeight: '400',
                marginHorizontal: 5,
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
      </View>
    </View>
  );
}

export default HomeHeader;
