import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, View, Text, Dimensions } from 'react-native';
import DailyTaskList from './DailyTaskList';
import { getDailyTasks } from '../../api/handleDailyTasks';
import AuthContext from '../../api/context';
import { useTheme } from '@rneui/themed';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import { Button } from '@rneui/base';
import { getNewTasks } from '../../api/getNewTasks';
import CircleLoading from '../../components/CircleLoading';
import * as Updates from 'expo-updates';

function DailyTaskIndex() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const { theme } = useTheme();
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle');
  console.log('status DailyTaskIndex', status);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  useEffect(() => {
    getDailyTasks(userId)
      .then((tasks) => {
        setDailyTasks(tasks);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleGetTodaysTask = async () => {
    setStatus('loading');
    const res = await getNewTasks(userId);
    Updates.reloadAsync();
    // reload the app

    if (res.length > 0) {
      setStatus('idle');
    } else {
      setStatus('noTask');
    }
  };

  return (
    <SafeAreaView
      style={
        {
          //backgroundColor: theme.colors.background,
          //height: Dimensions.get('window').height,
        }
      }>
      <View
        style={
          {
            //flex: 1,
            // direction: isRTL ? 'rtl' : 'ltr',
          }
        }>
        <Text
          style={{
            //color: theme.colors.text,
            fontSize: 17,
            fontWeight: '700',
            marginHorizontal: 15,
            marginVertical: 5,
            color: theme.colors.primary,
            fontFamily: 'Vazirmatn',
            textAlign: 'center',
          }}>
          {' '}
          {i18n.t('todayTasks')}
        </Text>
        {status === 'loading' && <CircleLoading />}
        {status === 'noTask' && (
          <View
            style={{
              backgroundColor: theme.colors.background,
              marginHorizontal: 16,
              borderRadius: 14,
              marginVertical: 5,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                marginHorizontal: 16,
                marginVertical: 5,
                fontFamily: 'Vazirmatn',
                textAlign: 'center',
              }}>
              {i18n.t('noTasksAvailable')}
            </Text>
          </View>
        )}

        {dailyTasks.length === 0 && (
          <View
            style={{
              backgroundColor: theme.colors.background,
              marginHorizontal: 16,
              borderRadius: 14,
              marginVertical: 5,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                marginHorizontal: 16,
                marginVertical: 5,
                fontFamily: 'Vazirmatn',
                textAlign: 'center',
              }}>
              {i18n.t('noTasks')}
            </Text>
            {status === 'idle' && (
              <Button
                buttonStyle={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 12,
                  paddingTop: 10,
                  width: Dimensions.get('window').width / 1.3,
                  marginHorizontal: 20,
                  marginVertical: 5,
                  height: Dimensions.get('window').height / 20,
                  alignSelf: 'center',
                }}
                title={i18n.t('getNewTasks')}
                titleStyle={{
                  color: theme.colors.white,
                  fontSize: 16,
                  fontFamily: 'Vazirmatn',
                }}
                onPress={() => {
                  handleGetTodaysTask();
                }}
              />
            )}
          </View>
        )}

        {dailyTasks.map((item, i) => (
          <DailyTaskList key={i} item={item} i18n={i18n} />
        ))}
        {/* <FlatList
          data={dailyTasks}
          renderItem={({ item }) => }
          keyExtractor={(item, index) => index.toString()}
        /> */}
      </View>
    </SafeAreaView>
  );
}

export default DailyTaskIndex;
