import React, { useContext, useEffect, useState } from 'react';
import {
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
import { useNavigation } from '@react-navigation/native';

function DailyTaskIndex({ title, taskStatus, setTaskStatus }) {
  // console.log('taskStatus', taskStatus);
  const [dailyTasks, setDailyTasks] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle');
  //console.log('status in daily', status);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  const navigation = useNavigation();
  useEffect(() => {
    handleGetTodaysTask();
  }, []);

  const handleGetTodaysTask = async () => {
    try {
      setStatus('loading');
      getDailyTasks(userId)
        .then((tasks) => {
          // console.log('tasks', tasks);
          if (tasks?.length === 0) {
            setTaskStatus('noTasks');
            setStatus('noTask');
          } else {
            setDailyTasks(tasks);
          }
          //console.log('tasks', tasks);
        })
        .catch((error) => {
          setStatus('noTask');
          console.log(error);
        });
    } catch (error) {
      console.log('error in getting new task', error);
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
            // marginVertical: 5,
            color: theme.colors.primary,
            fontFamily: 'Vazirmatn',
            textAlign: 'center',
          }}>
          {i18n.t('todayTasks')}
        </Text>

        {taskStatus === 'noTasks' && (
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: theme.colors.background,
              marginHorizontal: 8,
              borderRadius: 14,
              marginVertical: 0,
              // borderColor: theme.colors.border,
              // borderWidth: 1,
            }}>
            <Text style={styles.text}>
              {/* {i18n.t('noTasksAvailable')} */}
              {i18n.t('noTasksAvailable')}
            </Text>
            <View style={{ flexDirection: 'row' }}>
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
        {/* {status === 'loading' && <CircleLoading />} */}
        {status === 'noTask' && taskStatus !== 'noTasks' && (
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: theme.colors.background,
              marginHorizontal: 8,
              borderRadius: 14,
              marginVertical: 5,
              // borderColor: theme.colors.border,
              // borderWidth: 1,
            }}>
            <Text style={styles.text}>
              {/* {i18n.t('noTasksAvailable')} */}
              {i18n.t('getTodaysTask')}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  handleGetTodaysTask();
                }}>
                <Text style={styles.buttonTitle}>{i18n.t('retry')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {dailyTasks?.slice(0, 1).map((item, i) => (
          <DailyTaskList key={i} item={item} i18n={i18n} title={title.title} />
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
      width: Dimensions.get('window').width / 1.3,
      marginHorizontal: 10,
      marginVertical: 5,
      height: Dimensions.get('window').height / 20,
      //alignSelf: 'center',
    },
  });
