import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  PixelRatio,
  Pressable,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import { Button, useTheme } from '@rneui/themed';
import { Divider } from 'react-native-paper';
import LowPerformance from './finishPage/lowerPerformance';
import MidPerformance from './finishPage/midPerformance';
import HighPerformance from './finishPage/highPerformance';
import TopPerformance from './finishPage/topPerformance';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageContext from '../../api/langcontext';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import AuthContext from '../../api/context';
import i18nt from '../../locales';
import api from '../../api/api';
import { IconFire, Iconshare } from '../marketplace/filters/icons';
import formatTime from '../../api/timeFormat';
import { saveUserData } from '../../api/SaveData';
import { retrieveAndCalculatePerformance } from '../../api/SaveData';
import storeDataDB from '../../api/storedata';
import {
  PerformanceRead,
  calculateWorkoutPercentage,
  currentPalnPercentage,
  readSavedData,
  readWorkoutData,
} from '../../api/readWorkoutData';
import { getBurnedCalories } from '../../api/getBurnedCalories';

const UserWorkOutSessionDB = SQLite.openDatabase('userWorkOutSession.db');
const performanceDB = SQLite.openDatabase('performance.db');

const FinishSession = (props) => {
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
  const { category, location } = props.route.params;
  const [totalWeightSum, setToalWeightSum] = useState(0);
  const today = new Date().toISOString().slice(0, 10);
  const { userLanguage } = useContext(LanguageContext);
  const { timeSpent, setTimeSpent } = useContext(TimeSpentContext);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [burnedCalories, setBurnedCalories] = useState(null);
  // console.log('burnedCalories', burnedCalories.totalCaloriesBurned.toFixed(0));
  const { userAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const userId = userAuth.id;
  const { theme } = useTheme();
  const styles = getStyle(theme, PixelRatio);
  const numericCompletionPercentage = parseFloat(completionPercentage);

  const getUserWorkoutData = async () => {
    try {
      const data = await currentPalnPercentage();
      setUserWorkoutData(data);
      // console.log('data line 81', data);
    } catch (error) {}
  };

  useEffect(() => {
    getUserWorkoutData();
  }, []);

  const getData = async () => {
    // console.log('inside get data');
    try {
      const data = await readWorkoutData();

      calculateWorkoutPercentage(
        data?.totalSession,
        data?.addedDateTime,
        userWorkoutData?.data,
        data?.workoutPlanData.name
      );
    } catch (error) {
      console.log(error);
    }
  };

  const goShare = () => {
    //storeDataDB();

    getData();
    deleteSessiondata();
    navigation.navigate('SahreResult', {
      timeSpent: timeSpent,
      totalWeightSum: totalWeightSum,
      category: category,
      location: location,
      performance: completionPercentage,
    });
  };

  useEffect(() => {
    const getTempTotalWeight = async () => {
      const value = await AsyncStorage.getItem(`@total_weight`);
      if (value !== null) {
        console.log('value of async totalWeight', value);
        setToalWeightSum(value);
      } else {
        console.log('value of async totalWeight s', value);
        // setToalWeightSum(0);
      }
    };
    getTempTotalWeight();
  }, []);

  useEffect(() => {
    const getTempTimeSpend = async () => {
      const value = await AsyncStorage.getItem(`@time_spend`);
      if (value !== null) {
        console.log('value of async time spend', value);
        setTimeSpent(value);
      } else {
        console.log('value of async time spend s', value);
        setTimeSpent(0);
      }
    };
    getTempTimeSpend();
  }, []);

  // useEffect(() => {
  //   const getTempPerformance = async () => {
  //     const value = await AsyncStorage.getItem(`@SessionPerformance`);
  //     if (value !== null) {
  //       console.log('value of async temp performance', value);
  //       setCompletionPercentage(value);
  //     } else {
  //       console.log('value of async temp performance s', value);
  //       setCompletionPercentage(0);
  //     }
  //   };
  //   getTempPerformance();
  // }, []);

  const goHome = () => {
    storeDataDB();
    getData();
    deleteSessiondata();
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

  useEffect(() => {
    try {
      retrieveAndCalculatePerformance();
      sendData();
      sendPerformanceData();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleShowBurnedCalories = async () => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    const burnedCalories = await getBurnedCalories(userId, sessionId);
    if (!burnedCalories) {
      Alert.alert(
        i18n.t('burnedCalories'),
        i18n.t('burnedCaloriesDescription'),
        [
          {
            text: i18n.t('update'),
            onPress: () => navigation.navigate('IndexOnBoarding'),
          },
          {
            text: i18n.t('later'),
          },
        ],
        { cancelable: true }
      );
    }
    setBurnedCalories(burnedCalories);
  };

  useEffect(() => {
    handleShowBurnedCalories();
  }, []);

  const sendData = async () => {
    const data = await readSavedData(userId);

    try {
      const response = await api
        .post('/workouthistory', {
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
      const response = await api
        .post('/performancethistory', {
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

  const deleteSessiondata = async () => {
    await AsyncStorage.removeItem('@current_exercise_state');
    await AsyncStorage.removeItem('@total_weight');
    await AsyncStorage.removeItem('@time_spend');
    await AsyncStorage.removeItem('@SessionPerformance');
  };

  return (
    <View>
      <View
        style={{
          height: Dimensions.get('window').height / 1.5,
          paddingTop: 40,
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
              zIndex: 100,
            }}>
            <Iconshare />
          </TouchableOpacity>
          <View
            style={{
              height: Dimensions.get('window').height / 2.2,
            }}>
            {typeof numericCompletionPercentage === 'number' &&
              !isNaN(numericCompletionPercentage) && (
                <>
                  {numericCompletionPercentage < 50 && (
                    <LowPerformance
                      completionPercentage={numericCompletionPercentage}
                      text={i18n.t('lowerPerformanceText')}
                    />
                  )}
                  {numericCompletionPercentage >= 50 &&
                    numericCompletionPercentage < 70 && (
                      <MidPerformance
                        completionPercentage={numericCompletionPercentage}
                        text={i18n.t('midPerformanceText')}
                      />
                    )}
                  {numericCompletionPercentage >= 70 &&
                    numericCompletionPercentage < 90 && (
                      <HighPerformance
                        completionPercentage={numericCompletionPercentage}
                        text={i18n.t('highPerformanceText')}
                      />
                    )}
                  {numericCompletionPercentage >= 90 && (
                    <TopPerformance
                      completionPercentage={numericCompletionPercentage}
                      text={i18n.t('hiestPerformanceText')}
                    />
                  )}
                </>
              )}
          </View>

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
            {burnedCalories && (
              <View style={styles.view}>
                <Text style={styles.title}>
                  {burnedCalories.totalCaloriesBurned.toFixed(0)} kcal
                </Text>
                <Pressable onPress={() => handleShowBurnedCalories()}>
                  <Text style={styles.subtitle}>
                    {i18n.t('burnedCalories')}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: -20,
                    }}>
                    <IconFire />
                  </View>
                </Pressable>
              </View>
            )}
            <Divider style={styles.divider} />
            <View style={styles.view}>
              <Text style={styles.title}>{formatTime(timeSpent)}</Text>
              <Text style={styles.subtitle}>{i18n.t('sessionDuration')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          top: Dimensions.get('window').height / 1.1,
          width: Dimensions.get('window').width / 1.2,
          // alignSelf: 'center',
          height: 100,
          marginBottom: 100,
          flexDirection: 'row',
        }}>
        <Button
          onPress={() => goHome()}
          buttonStyle={{
            backgroundColor: theme.colors.button,
            width: Dimensions.get('window').width / 1.1,
            marginHorizontal: 20,
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

export default FinishSession;

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
      fontSize: PixelRatio.get() < 3 ? 10 : 12,
      fontWeight: '400',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 5,
      marginHorizontal: 5,
    },
    category: {
      fontSize: PixelRatio.get() < 3 ? 10 : 16,
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
      fontSize: PixelRatio.get() < 3 ? 14 : 16,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 20,
    },
  });
