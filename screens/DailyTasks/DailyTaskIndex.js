import React, { useContext, useEffect, useState } from 'react';
import {
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
  console.log('taskStatus in daily index', taskStatus);
  const [dailyTasks, setDailyTasks] = useState([]);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const [status, setStatus] = useState('idle');
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
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
            setStatus('noTasks');
          } else {
            setDailyTasks(tasks);
          }
          //console.log('tasks', tasks);
        })
        .catch((error) => {
          setStatus('noTasks');
          console.log(error);
        });
    } catch (error) {
      console.log('error in getting new task', error);
      setStatus('noTasks');
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text
          style={{
            //color: theme.colors.text,
            fontSize: 14,

            marginHorizontal: 15,
            marginBottom: 5,
            color: theme.colors.primary,
            fontFamily: 'Vazirmatn',
            textAlign: 'center',
          }}>
          {i18n.t('todayTasks')}
        </Text> */}

      {taskStatus === 'noTasks' && (
        <View
          style={{
            //  flexDirection: 'column',
            //backgroundColor: theme.colors.background,
            marginHorizontal: 8,
            borderRadius: 14,
            // top: 20,
            // borderColor: theme.colors.border,
            // borderWidth: 1,
          }}>
          <View
            style={{ flexDirection: 'column', position: 'absolute', top: 10 }}>
            <Text style={styles.text}>{i18n.t('noTasksAvailable')}</Text>
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

      {dailyTasks?.slice(0, 1).map((item, i) => (
        <DailyTaskList key={i} item={item} i18n={i18n} title={title.title} />
      ))}
    </View>
  );
}

export default DailyTaskIndex;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
    },

    text: {
      color: theme.colors.warning,
      fontSize: 16,
      marginHorizontal: 16,
      marginVertical: 5,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
      zIndex: 100,
    },
    buttonTitle: {
      color: theme.colors.secondary,
      fontSize: 14,
      marginHorizontal: 16,
      marginVertical: 5,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: 12,
      //paddingTop: 15,
      width: Dimensions.get('window').width / 1.2,
      marginHorizontal: 0,
      marginVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
      height: Dimensions.get('window').height / 15,
      alignSelf: 'center',
    },
  });
