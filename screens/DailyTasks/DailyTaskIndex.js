import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DailyTaskList from './DailyTaskList';
import { getDailyTasks } from '../../api/handleDailyTasks';
import AuthContext from '../../api/context';
import { useTheme } from '@rneui/themed';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import { getNewTasks } from '../../api/getNewTasks';
import CircleLoading from '../../components/CircleLoading';
import * as Updates from 'expo-updates';
import { useNavigation } from '@react-navigation/native';

function DailyTaskIndex() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle');
  console.log('status DailyTaskIndex', status);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  const navigation = useNavigation();
  useEffect(() => {
    getDailyTasks(userId)
      .then((tasks) => {
        if (tasks.length === 0) {
          setStatus('noTask');
        } else {
          setDailyTasks(tasks);
        }
        //console.log('tasks', tasks);
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
      <View style={styles.container}>
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
              flexDirection: 'column',
              backgroundColor: theme.colors.background,
              marginHorizontal: 16,
              borderRadius: 14,
              marginVertical: 5,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }}>
            <Text style={styles.text}>
              {/* {i18n.t('noTasksAvailable')} */}
              {i18n.t('noTasksAvailable')}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleGetTodaysTask();
                }}>
                <Text style={styles.buttonTitle}>{i18n.t('retry')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  navigation.navigate('SessionNavigator');
                }}>
                <Text style={styles.buttonTitle}>
                  {i18n.t('seeLastExercises')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {dailyTasks?.slice(0, 1).map((item, i) => (
          <DailyTaskList key={i} item={item} i18n={i18n} />
        ))}
      </View>
    </SafeAreaView>
  );
}

export default DailyTaskIndex;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {},

    text: {
      color: theme.colors.text,
      fontSize: 16,
      marginHorizontal: 16,
      marginVertical: 5,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    buttonTitle: {
      color: theme.colors.white,
      fontSize: 10,
      marginHorizontal: 16,
      marginVertical: 5,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    button: {
      backgroundColor: theme.colors.secondary,
      borderRadius: 12,
      paddingTop: 10,
      width: Dimensions.get('window').width / 2.8,
      marginHorizontal: 10,
      marginVertical: 5,
      height: Dimensions.get('window').height / 20,
      //alignSelf: 'center',
    },
  });
