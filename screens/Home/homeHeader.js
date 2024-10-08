import { Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Dimensions, PixelRatio, View } from 'react-native';
import AuthContext from '../../api/context';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

import {
  IconHeaderNotStarted,
  IconStarted,
} from '../marketplace/filters/icons';

import { useState } from 'react';
import UserPrivilegeContext from '../../api/userPrivilegeContext';
import { getHeaderReport } from '../../api/headerReportAPI';

function HomeHeader() {
  const { userAuth } = useContext(AuthContext);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [textMessage, setTextMessage] = useState('');
  const [activeAccount, setActiveAccount] = useState(true);
  const [status, setStatus] = useState('good');
  const userLevel = userAuth.level;
  const userId = userAuth.id;
  const { userPrivilege } = useContext(UserPrivilegeContext);
  const [backgroundColor, setBackgroundColor] = useState(
    theme.colors.lightPrimary
  );

  // useEffect(() => {
  //   const res = generateHeaderText(planStartDate, data, i18n, title);
  //   activeAccount && setTextMessage(res.message);
  // }, [planStartDate, data, i18n, title]);
  const BACKGROUND_FETCH_TASK = 'background-fetch';

  useEffect(() => {
    checkUserPervilage();
  }, [userPrivilege]);

  const getHeaderData = async () => {
    const res = await getHeaderReport(userId, userLanguage);

    if (res) {
      setTextMessage(res.message);
    }
  };

  useEffect(() => {
    getHeaderData();
  }, [userAuth]);

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

  useEffect(() => {
    checkUserPervilage();
  }, []);

  const messageLength = textMessage.length;

  const navigation = useNavigation();
  const RTL = userLanguage === 'fa';
  useEffect(() => {
    const getcurrentwotkout = async () => {
      const value = await AsyncStorage.getItem('currentWorkout');

      // Push notification responseconsole.log('current workout', value);
    };

    getcurrentwotkout();
  }, []);

  return (
    <View
      style={{
        flexDirection: 'row',
        height: 60,
        // width: Dimensions.get('window').width / 1.4,
        alignItems: 'center',
      }}>
      <View>
        <View
          style={{
            padding: 5,
            flexDirection: 'row',
            direction: RTL ? 'rtl' : 'ltr',
            backgroundColor: theme.colors.lightPrimary,
            paddingHorizontal: 2,
            marginHorizontal: 20,
            width: Dimensions.get('window').width / 1.1,
            borderRadius: 10,
          }}>
          <Text
            onPress={() => !activeAccount && navigation.navigate('Upgrade')}
            style={{
              color: theme.colors.secondary,
              fontSize: messageLength > 50 || PixelRatio.get() < 3 ? 11 : 13,
              flexWrap: 'wrap',
              flex: 1,
              paddingVertical: 8,
              fontFamily: 'Vazirmatn',
              fontWeight: '400',
              marginHorizontal: 10,
            }}>
            {textMessage}
          </Text>
          <View
            style={{
              padding: 5,
            }}>
            {status === 'bad' ? <IconHeaderNotStarted /> : <IconStarted />}
          </View>
        </View>
      </View>
    </View>
  );
}

export default HomeHeader;
