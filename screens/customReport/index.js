import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useTheme } from '@rneui/themed';
import Header from '../../components/header';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { filterByDates } from '../../api/readWorkoutData';
import { Iconshare } from '../marketplace/filters/icons-';
import { userWorkoutHistory } from '../../api/workoutSessionTracker';
import AuthContext from '../../api/context';
import { G, Polygon, Svg } from 'react-native-svg';

const db = SQLite.openDatabase('performance.db');
const CustomReport = () => {
  const { userLanguage } = useContext(LanguageContext);
  const [reportHistoryDates, setReportHistoryDates] = useState();
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const Styles = getStyles(theme);
  const imageRef = useRef();
  const [filteredData, setFilteredData] = useState([]);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const RTL = userLanguage === 'fa';
  const handleHistoryData = async () => {
    const res = await userWorkoutHistory(userId);
    // console.log('history result', res);
    setFilteredData(res);
  };

  // const filteredData = [
  //   {
  //     category: 'Cardio',
  //     date: '2024-02-10',
  //     id: 3,
  //     location: 'Gym',
  //     performance: 90.18,
  //     timeSpent: 299,
  //   },
  //   {
  //     category: 'Full Body',
  //     date: '2024-02-12',
  //     id: 3,
  //     location: 'Gym',
  //     performance: 95.98,
  //     timeSpent: 299,
  //   },
  //   {
  //     category: 'Core & Upper',
  //     date: '2024-02-13',
  //     id: 1,
  //     location: 'Gym',
  //     performance: 85.15,
  //     timeSpent: 631,
  //   },
  //   {
  //     category: 'Lower Body',
  //     date: '2024-02-15',
  //     id: 3,
  //     location: 'Gym',
  //     performance: 95.83,
  //     timeSpent: 299,
  //   },
  //   {
  //     category: 'upper Body',
  //     date: '2024-02-17',
  //     id: 3,
  //     location: 'Gym',
  //     performance: 92.13,
  //     timeSpent: 299,
  //   },
  // ];

  //console.log('filteredData', filteredData);
  // New state variable for filtered data
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD'); // Get tomorrow's date in YYYY-MM-DD format
  const pastSevenDays = moment().subtract(7, 'days').format('YYYY-MM-DD'); // Get the date 7 days ago
  const pastThirtyDays = moment().subtract(30, 'days').format('YYYY-MM-DD'); // Get the date 30 days ago

  const takeScreenshot = () => {
    captureRef(imageRef, {
      format: 'jpg',
      quality: 0.8,
    }).then(
      async (uri) => {
        alert(i18n.t('ScreenshotCaptured'));
        await MediaLibrary.saveToLibraryAsync(uri);
        // Here you can save the image to the gallery or share it
      },
      (error) => console.error('Oops, snapshot failed', error)
    );
  };

  // const getResult = async () => {
  //   try {
  //     const res = await filterByDates(pastSevenDays, tomorrow);
  //     setFilteredData(res); // pass the fetched data to setFilteredData function
  //   } catch (error) {
  //     console.log('error', error);
  //   }
  // };

  useEffect(() => {
    // getResult();
    handleHistoryData();
  }, []);

  const groupByDateAndCategory = (data) => {
    //console.log('data', data);
    const grouped = {};
    data?.forEach((item) => {
      const date = item?.date || 'Unknown';
      const category = item?.category || 'Unknown';
      const location = item?.location || 'Unknown';
      const performance = item?.performance || 'Unknown';

      if (!grouped[date]) {
        grouped[date] = {};
      }

      if (!grouped[date][category]) {
        grouped[date][category] = [];
      }

      grouped[date][category].push({ location, performance, date });
    });

    return grouped;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        height: Dimensions.get('window').height,
      }}>
      <StatusBar style="auto" />
      <Header title={i18n.t('report')} />
      <ScrollView>
        <View>
          <View ref={imageRef}>
            <View
              style={{
                backgroundColor: theme.colors.background,
                margin: 5,
                borderRadius: 10,
                padding: 5,
                flex: 1,
                borderRadius: 10,

                borderColor: theme.colors.secondary,
                // top: Platform.OS === 'ios' ? 30 : 40,
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  margin: 5,
                  borderRadius: 10,
                  padding: 5,
                }}>
                <Text style={Styles.title}>{i18n.t('workoutHistory')}</Text>
                {filteredData?.length > 0 && (
                  <Text style={Styles.title}>
                    {filteredData.length} {i18n.t('workouts')}
                  </Text>
                )}
                {filteredData?.length === 0 && (
                  <Text style={Styles.title}>{i18n.t('noWorkouts')}</Text>
                )}

                {filteredData
                  ?.sort(
                    (a, b) =>
                      new Date(b.sessionStartDate) -
                      new Date(a.sessionStartDate)
                  )
                  .map((item, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          margin: 5,
                          borderRadius: 10,
                          padding: 5,
                          borderColor: theme.colors.border,
                          borderWidth: 1,
                        }}>
                        <View
                          style={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                          }}>
                          <Svg height="70" width="70">
                            <Polygon
                              points="0 0, 0 10, 10 10"
                              fill={
                                item.sessionStatus === 'completed'
                                  ? theme.colors.success
                                  : theme.colors.warning
                              }
                              strokeWidth="0"
                            />
                            <Polygon
                              points="0 0, 70 70, 70 40, 30 0"
                              fill={
                                item.sessionStatus === 'completed'
                                  ? theme.colors.success
                                  : theme.colors.warning
                              }
                              strokeWidth="0"
                            />
                            <Polygon
                              points="60 60, 60 70, 70 70"
                              fill={
                                item.sessionStatus === 'completed'
                                  ? theme.colors.success
                                  : theme.colors.warning
                              }
                              strokeWidth="0"
                            />
                            <G rotation="45" origin="130, -10">
                              <Text style={Styles.status}>
                                {item.sessionStatus === 'pending' &&
                                  i18n.t('pending')}
                                {item.sessionStatus === 'started' &&
                                  i18n.t('pending')}
                                {item.sessionStatus === 'uncompleted' &&
                                  i18n.t('missed')}

                                {item.sessionStatus === 'completed' &&
                                  i18n.t('completed')}
                                {item.sessionStatus === 'missed' &&
                                  i18n.t('missed')}
                              </Text>
                            </G>
                          </Svg>
                        </View>

                        <Text style={Styles.date}>
                          {moment(item.sessionStartDate).format('YYYY-MM-DD')}
                        </Text>
                        {item.sessionEndDate != null && (
                          <Text style={Styles.date}>
                            {i18n.t('sessionDuration')} :{' '}
                            {moment(item.sessionEndDate).diff(
                              moment(item.sessionStartDate),
                              'minutes'
                            )}{' '}
                            {i18n.t('minute')}
                          </Text>
                        )}
                        {/* 
                      moment difference between two dates in minutes
                     
*/}
                        <Text style={Styles.title}>{item.planName}</Text>
                        <Text style={Styles.subtitle}>
                          {}

                          {i18n.t('doneWorkoutAt', {
                            workout: item.dayName,
                            location:
                              item.location === 'Gym'
                                ? i18n.t('workOutAtGym')
                                : i18n.t('workOutAtHome'),
                          })}
                        </Text>

                        {item.burnedCalories != null && (
                          <Text style={Styles.calories}>
                            {`${i18n.t(
                              'burnedCalories'
                            )} ${item.burnedCalories.toFixed(0)}`}{' '}
                            {i18n.t('calories')}
                          </Text>
                        )}
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '400',

      fontFamily: 'Vazirmatn',
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: 'Vazirmatn',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    date: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Vazirmatn',
      flexWrap: 'wrap',
    },
    container: {
      margin: 10,
      //borderRadius: 10,
      padding: 10,
      flex: 1,
      top: Platform.OS === 'ios' ? 30 : 40,
    },
    dateContainer: {
      backgroundColor: theme.colors.background,
      margin: 5,
      borderRadius: 10,
      padding: 5,
    },
    subtitle: {
      fontWeight: '400',
      fontSize: 14,
      textAlign: 'center',
      color: theme.colors.text,
      fontFamily: 'Vazirmatn',
    },
    calories: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderRadius: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#333',
    },
    itemContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      padding: 5,
      borderRadius: 5,
      marginVertical: 2,
    },
    status: {
      position: 'absolute',
      top: 20,
      right: 0,
      transform: [{ rotate: '45deg' }],
      color: 'white',
    },
    itemText: {
      fontSize: 14,
      color: theme.colors.text,
    },
  });

export default CustomReport;
