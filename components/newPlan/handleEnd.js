import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import axios from 'axios';
import AuthContext from '../../api/context';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import { Button, useTheme } from '@rneui/themed';
import getTotalWeight from '../../api/getTotalWeight';
import { PerformanceRead } from '../../api/readWorkoutData';
import { calculateWorkoutPercentage } from '../../api/readWorkoutData';
import { currentPalnPercentage } from '../../api/readWorkoutData';
import { readSavedData, readWorkoutData } from '../../api/readWorkoutData';
import { Divider } from 'react-native-paper';
import LowPerformance from './finishPage/lowerPerformance';
import MidPerformance from './finishPage/midPerformance';
import HighPerformance from './finishPage/highPerformance';
import TopPerformance from './finishPage/topPerformance';
import formatTime from '../../api/timeFormat';
import { Iconshare } from '../../screens/marketplace/filters/icons';
import { retrieveAndCalculatePerformance } from '../../api/SaveData';
import { saveUserData } from '../../api/SaveData';
import * as SQLite from 'expo-sqlite';
const UserWorkOutSessionDB = SQLite.openDatabase('userWorkOutSession.db');
const performanceDB = SQLite.openDatabase('performance.db');
const Handleend = (props) => {
  // Replace with your actual database name

  useEffect(() => {
    UserWorkOutSessionDB.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS userWorkOutSession (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, data TEXT);'
      );
    });
  }, []);

  useEffect(() => {
    //create performance table

    performanceDB.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS performance (id INTEGER PRIMARY KEY AUTOINCREMENT,  category TEXT, location TEXT, timeSpent INTEGER, performance INTEGER, date TEXT);'
      );
    });
  }, []);

  const [userWorkoutData, setUserWorkoutData] = useState([]);
  const { category, location, completionPercentage } = props.route.params;

  const [totalWeightSum, setToalWeightSum] = useState(0);
  const today = new Date().toISOString().slice(0, 10);
  const { userLanguage } = useContext(LanguageContext);
  const { timeSpent } = useContext(TimeSpentContext);
  const { userAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const userId = userAuth.id;
  const { theme } = useTheme();
  const styles = getStyle(theme, PixelRatio);

  const getUserWorkoutData = async () => {
    currentPalnPercentage().then((data) => {
      setUserWorkoutData(data);
    });
  };

  useEffect(() => {
    getUserWorkoutData();
  }, []);

  const getData = async () => {
    try {
      const data = await readWorkoutData();
      console.log('inside get data', data);
      calculateWorkoutPercentage(
        data?.totalSessions,
        data?.dataObject.addedDateTime,
        userWorkoutData?.data,
        data?.dataObject.item.name
      );
    } catch (error) {
      return false;
    }
  };

  const goShare = () => {
    getData();

    navigation.navigate('FinishWorkOut', {
      timeSpent: timeSpent,
      totalWeightSum: totalWeightSum,
      category: category,
      location: location,
      performance: completionPercentage,
    });
  };

  const goHome = () => {
    getData();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  useEffect(() => {
    saveUserData(
      category,
      location,
      timeSpent,
      totalWeightSum,
      completionPercentage
    );
    retrieveAndCalculatePerformance(
      category,
      location,
      timeSpent,
      completionPercentage,
      today
    );
  }, []);
  // Function to retrieve and calculate the sum

  const getSumTotalWeight = async () => {
    try {
      const sum = await getTotalWeight({ category, today });
      setToalWeightSum(sum === null ? 0 : sum);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      //console.log('inside useEffect');
      getSumTotalWeight();
      retrieveAndCalculatePerformance();
      sendData();
      sendPerformanceData();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const sendData = async () => {
    const data = await readSavedData(userId);

    try {
      const response = await axios
        .post('https://jobitta.com/workouthistory', {
          data,
        })
        .then((response) => {
          setLoading(false);
        });
    } catch (error) {
      console.log('error');
      setLoading(false);
      return false;
    }
  };

  const sendPerformanceData = async () => {
    // console.log(await PerformanceRead(userId));

    const data = await PerformanceRead(userId);
    setLoading(false);
    try {
      const response = await axios
        .post('https://jobitta.com/performancethistory', {
          data,
        })
        .then((res) => {
          setLoading(false);
          // console.log('res for performance');
        });
    } catch (error) {
      console.log(error);
      setLoading(false);

      return false;
    }
  };

  return (
    <View>
      <View
        style={{
          height: Dimensions.get('window').height,
          marginTop: 40,
        }}>
        <View
          style={{
            top: 30,
            marginBottom: 50,
            flexDirection: 'column',

            width: Dimensions.get('window').width / 1.1,
            alignSelf: 'center',
            height: Dimensions.get('window').height / 2 - 100,
          }}>
          <TouchableOpacity
            onPress={() => goShare()}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 1,
            }}>
            <Iconshare />
          </TouchableOpacity>
          {completionPercentage && (
            <View
              style={{
                height: Dimensions.get('window').height / 2.2,
              }}>
              {completionPercentage < 50 && (
                <LowPerformance
                  completionPercentage={completionPercentage}
                  text={i18n.t('lowerPerformanceText')}
                />
              )}
              {completionPercentage >= 50 && completionPercentage < 70 && (
                <MidPerformance
                  completionPercentage={completionPercentage}
                  text={18n.t('midPerformanceText')}
                />
              )}
              {completionPercentage >= 70 && completionPercentage < 90 && (
                <HighPerformance
                  completionPercentage={completionPercentage}
                  text={i18n.t('highPerformanceText')}
                />
              )}
              {completionPercentage >= 90 && (
                <TopPerformance
                  completionPercentage={completionPercentage}
                  text={i18n.t('hiestPerformanceText')}
                />
              )}
            </View>
          )}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: Dimensions.get('window').width / 1.1,
              // top: Dimensions.get('window').height / 3.5,
              height: 100,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: 16,
              marginTop: 15,
            }}>
            {category !== 'Cardio' && (
              <>
                <View style={styles.view}>
                  <Text style={styles.title}>
                    {totalWeightSum}
                    <Text style={styles.subtitle}> {i18n.t('kg')}</Text>
                  </Text>
                  <Text style={styles.subtitle}>{i18n.t('liftedweight')}</Text>
                </View>
                <Divider style={styles.divider} />
              </>
            )}
            <View style={styles.view}>
              <Text style={styles.title}>{completionPercentage}</Text>
              <Text style={styles.subtitle}>{i18n.t('performance')}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.view}>
              <Text style={styles.title}>{formatTime(timeSpent)}</Text>
              <Text style={styles.subtitle}>{i18n.t('duration')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: Dimensions.get('window').width,
          height: 100,
          marginBottom: 40,
          flexDirection: 'row',
        }}>
        <Button
          onPress={() => goHome()}
          buttonStyle={{
            backgroundColor: theme.colors.button,
            width: Dimensions.get('window').width - 20,
            marginHorizontal: 10,
            height: 50,
            borderRadius: 12,
          }}
          titleStyle={{
            color: theme.colors.text,
            fontSize: 15,
            fontWeight: '400',
            color: '#fff',
          }}
          title={i18n.t('home')}
        />
      </View>
    </View>
  );
};

export default Handleend;

const getStyle = (theme, PixelRatio) =>
  StyleSheet.create({
    buttonContainer: {
      //position: 'absolute',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    weight: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      // marginTop: 60,
    },
    divider: {
      height: 70,
      width: 1,
      marginVertical: 10,
      backgroundColor: theme.colors.border,
    },
    view: {
      height: 70,
      //borderEndWidth: 1,
      width: Dimensions.get('window').width / 4,
      justifyContent: 'space-between',
      alignItems: 'center',

      borderColor: theme.colors.border,
      padding: 5,
      marginHorizontal: 10,
      //marginVertical: 10,
    },

    subtitle: {
      fontSize: PixelRatio.get() < 3 ? 10 : 14,
      fontWeight: '400',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 5,
      marginHorizontal: 5,
    },
    category: {
      fontSize: PixelRatio.get() < 3 ? 10 : 20,
      fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      marginTop: 20,
    },
    loadingText: {
      fontSize: 15,
      //fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      marginTop: 20,
    },
    title: {
      fontSize: PixelRatio.get() < 3 ? 14 : 18,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 20,
    },
  });
