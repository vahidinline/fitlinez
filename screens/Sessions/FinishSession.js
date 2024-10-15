import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PixelRatio,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { I18n } from 'i18n-js';
import { Button, useTheme } from '@rneui/themed';
import { Divider } from 'react-native-paper';

import TopPerformance from './finishPage/topPerformance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LanguageContext from '../../api/langcontext';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import AuthContext from '../../api/context';
import i18nt from '../../locales';

import { IconFire } from '../marketplace/filters/icons';
import formatTime from '../../api/timeFormat';
// import { retrieveAndCalculatePerformance } from '../../api/SaveData';
import storeDataDB from '../../api/storedata';
import {
  calculateWorkoutPercentage,
  readWorkoutData,
} from '../../api/readWorkoutData';
import { getBurnedCalories } from '../../api/getBurnedCalories';
import convertToPersianNumbers from '../../api/PersianNumber';
import { se } from 'make-plural';
import { SessionContext } from '../../api/sessionContext';

const FinishSession = (props) => {
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
  const RTL = userLanguage === 'fa';
  const { setSessionData } = useContext(SessionContext);
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
    setSessionData([]);
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

  const goHome = () => {
    storeDataDB();
    getData();
    deleteSessiondata();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  // useEffect(() => {
  //   try {
  //     // retrieveAndCalculatePerformance();
  //     //sendData();
  //   //  sendPerformanceData();
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, []);

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

  // const sendData = async () => {
  //   const data = await readSavedData(userId);

  //   try {
  //     const response = await api
  //       .post('/workouthistory', {
  //         data,
  //       })
  //       .then((response) => {
  //         setLoading(false);
  //       });
  //   } catch (error) {
  //     console.log('error');
  //     setLoading(false);
  //     return false;
  //   }
  // };

  // const sendPerformanceData = async () => {
  //   // console.log(await PerformanceRead(userId));

  //   const data = await PerformanceRead(userId);
  //   setLoading(false);
  //   try {
  //     const response = await api
  //       .post('/performancethistory', {
  //         data,
  //       })
  //       .then((res) => {
  //         setLoading(false);
  //         // console.log('res for performance');
  //       });
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);

  //     return false;
  //   }
  // };

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
          {/* <TouchableOpacity
            onPress={() => goShare()}
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 100,
            }}>
            <Iconshare />
          </TouchableOpacity> */}
          <View
            style={{
              height: Dimensions.get('window').height / 2.2,
            }}>
            <TopPerformance
              //completionPercentage={numericCompletionPercentage}
              text={i18n.t('hiestPerformanceText')}
            />
          </View>
          <View>
            {burnedCalories && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  // width: Dimensions.get('window').width / 1.1,
                  // top: Dimensions.get('window').height / 3.5,
                  height: 50,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 16,
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Text
                  style={{
                    color: theme.colors.secondary,
                    fontSize: PixelRatio.get() < 3 ? 10 : 12,
                    fontFamily: 'Vazirmatn',
                  }}>
                  {i18n.t('burnedCalories')}
                </Text>
                <Text>:</Text>
                <Text
                  style={{
                    color: theme.colors.secondary,
                    fontSize: PixelRatio.get() < 3 ? 10 : 12,
                    fontFamily: 'Vazirmatn',
                  }}>
                  {convertToPersianNumbers(
                    burnedCalories.totalCaloriesBurned.toFixed(0),
                    RTL
                  )}{' '}
                  {i18n.t('calories')}
                </Text>
                <IconFire />
              </View>
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
                    {convertToPersianNumbers(totalWeightSum, RTL)}
                    <Text style={styles.subtitle}> {i18n.t('kg')}</Text>
                  </Text>
                  <Text style={styles.subtitle}>{i18n.t('liftedweight')}</Text>
                </View>
                <Divider style={styles.divider} />
              </>
            )}

            <View style={styles.view}>
              <Text style={styles.title}>{formatTime(timeSpent, RTL)}</Text>
              <Text style={styles.subtitle}>{i18n.t('sessionDuration')}</Text>
            </View>
          </View>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          top: Dimensions.get('window').height / 1.2,
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
            fontFamily: 'Vazirmatn',
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
      fontFamily: 'Vazirmatn',
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
      fontFamily: 'Vazirmatn',
      fontWeight: '400',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 5,
      marginHorizontal: 5,
      width: '100%',
    },
    category: {
      fontSize: PixelRatio.get() < 3 ? 10 : 16,
      fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      marginTop: 20,
      fontFamily: 'Vazirmatn',
    },
    loadingText: {
      fontSize: 15,
      //fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      marginTop: 20,
      fontFamily: 'Vazirmatn',
    },
    title: {
      fontSize: PixelRatio.get() < 3 ? 14 : 16,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 20,
      fontFamily: 'Vazirmatn',
    },
  });
