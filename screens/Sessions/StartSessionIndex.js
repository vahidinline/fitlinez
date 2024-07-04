import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  AppState,
  TouchableOpacity,
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import { I18n } from 'i18n-js';
import { Text } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useTheme } from '@rneui/themed';
import AuthContext from '../../api/context';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { IconArrowLeft, IconArrowRight } from '../marketplace/filters/icons';
import Header from '../../components/header';
import { userLevelCheck, userStatusCheck } from '../../api/GetData';
import BannerAdMob from '../../api/AdMob/BannerComponent';
import { Divider } from 'react-native-paper';

require('moment/locale/fa');
require('moment/locale/en-gb');

const db0 = SQLite.openDatabase('totalWeight.db');
const db1 = SQLite.openDatabase('packeges.db');

const StartSessionIndex = ({ route }) => {
  const { theme } = useTheme();
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const { timeSpent, setTimeSpent } = useContext(TimeSpentContext);
  //console.log('timeSpent in index new plan', timeSpent);
  const [workoutPlan, setWorkoutPlan] = useState([]);

  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const [timestamp, setTimestamp] = useState([]);

  const [title, setTitle] = useState(
    route.params && route.params.title ? route.params.title : 'your Plan'
  );
  const [location, setLocation] = useState(
    route.params && route.params.location ? route.params.location : 'gym'
  );
  //console.log('route in index newPlan', route);
  //console.log('location in index newPlan', location);
  //console.log('location in index newPlan', location);
  i18n.locale = userLanguage;
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const RTL = userLanguage === 'fa' ? true : false;
  //console.log('timeSpent in index new plan', timeSpent);
  const saveWorkoutsList = async () => {
    await AsyncStorage.getItem('workoutsList').then((value) => {
      if (value !== null) {
        // console.log('value in index from async', JSON.parse(value).data.data);
        const workoutsList = JSON.parse(value).data.data;
        // console.log('workoutsList', workoutsList[0].data);
        setWorkoutPlan(workoutsList);
      } else {
        console.log('doesnt have value');
      }
    });
  };

  useEffect(() => {
    setTimeSpent(0);
  }, []);

  useEffect(() => {
    db1.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS packeges (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, data TEXT);'
      );
    });
  }, []);

  const retrieveTimestampsByCategory = (category) => {
    setTimestamp([]);
    // console.log('category in retrieveTimestampsByCategory', category);
    db0.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM totalWeight WHERE category = ? ORDER BY timestamp DESC LIMIT 1;',
          [category],
          (tx, results) => {
            const numRows = results.rows.length;
            if (numRows > 0) {
              for (let i = 0; i < numRows; i++) {
                //update setTimestamp array here

                setTimestamp((prev) => [
                  ...prev,
                  {
                    timestamp: results.rows.item(i).timestamp,
                    category: results.rows.item(i).category,
                  },
                ]);
                // console.log(
                //   'Database response:',
                //   results.rows.item(i).timestamp,
                //   results.rows.item(i).category
                // );
              }
            } else {
              return;
            }
          },
          (tx, error) => {
            return;
          }
        );
      },
      (error) => {
        return;
      },
      () => {
        return;
      }
    );
  };

  useEffect(() => {
    saveWorkoutsList();
  }, []);
  const daysOfWeek = [
    {
      id: 1,
      nameT: 'شنبه',
      name: 'Saturday',
    },
    {
      id: 2,
      nameT: 'یکشنبه',
      name: 'Sunday',
    },
    {
      id: 3,
      nameT: 'دوشنبه',
      name: 'Monday',
    },

    {
      id: 4,
      nameT: 'سه شنبه',
      name: 'Tuesday',
    },
    {
      id: 5,
      nameT: 'چهارشنبه',
      name: 'Wednesday',
    },
    {
      id: 6,
      nameT: 'پنجشنبه',
      name: 'Thursday',
    },
    {
      id: 7,
      nameT: 'جمعه',
      name: 'Friday',
    },
  ];
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        userStatusCheck();
        userLevelCheck(userAuth, setUserAuth);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      //console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const goToWorkOut = (item) => {
    navigation.navigate('WeeklyPlan', {
      baseLocation: location,
      data: item.data,
      title: item.title,
      day: item.day,
      category: item.data[0]?.category,
      planName: title,
    });
  };

  //show timetamp value for each category

  const showDate = (category, userLanguage) => {
    moment.locale(userLanguage); // set the locale based on userLanguage
    for (let i = 0; i < timestamp.length; i++) {
      if (timestamp[i].category === category) {
        //return moment(timestamp[i].timestamp).endOf('day').fromNow();
        return moment(timestamp[i].timestamp).format('DD/MM/YYYY');
      }
    }
  };

  const findMatchingDay = (day, daysOfWeeks) => {
    for (const daysOfWeek of daysOfWeeks) {
      if (day === daysOfWeek.name) {
        if (userLanguage === 'fa') {
          return daysOfWeek.nameT;
        } else {
          return daysOfWeek.name;
        }
      }
    }
    return null; // Return null if no matching workoutCategory.name is found
  };

  useEffect(() => {
    const fetchTimestamps = async () => {
      const uniqueCategories = [
        ...new Set(workoutPlan.map((item) => item.title)),
      ];
      //console.log('uniqueCategories', uniqueCategories);
      for (let category of uniqueCategories) {
        try {
          const lastTimestamp = await retrieveTimestampsByCategory(category);

          // Store this timestamp in a suitable state or some data structure.
          // For example, you can have an object where the key is the category and value is the last timestamp.
        } catch (error) {
          console.error(
            `Error fetching timestamp for category ${category}:`,
            error
          );
        }
      }
    };

    fetchTimestamps();
    //saveWorkoutsList();
  }, [workoutPlan]);

  const today = new Date();
  let startSunday = new Date();

  // If today is Sunday, set the start date as today. Otherwise, find the next Sunday.
  if (today.getDay() === 0) {
    startSunday = today;
  } else {
    startSunday.setDate(today.getDate() + (7 - today.getDay()));
  }

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        //direction: RTL ? 'rtl' : 'ltr',
      }}>
      <Header title={title} />
      <ScrollView>
        {/* sort by day */}

        {workoutPlan
          ?.sort((a, b) => {
            const indexA = daysOfWeek.findIndex((day) => day.name === a.day);
            const indexB = daysOfWeek.findIndex((day) => day.name === b.day);

            return indexA - indexB;
          })
          .map((item, i) => {
            return (
              <View key={`item-${i}`}>
                <TouchableOpacity
                  disabled={
                    item.title === 'Rest' ||
                    //lower case walking and running
                    item.title.toLowerCase() === 'walking' ||
                    item.title.toLowerCase() === 'running'
                      ? true
                      : false
                  }
                  onPress={() => {
                    item.title === 'Rest' ? null : goToWorkOut(item);
                  }}
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backgroundColor:
                      item.title !== 'Rest'
                        ? theme.colors.background
                        : theme.colors.disabled,
                    marginHorizontal: 16,
                    height: item.title !== 'Rest' ? 120 : 80,
                    marginVertical: 8,
                    borderRadius: 16,
                    borderColor: theme.colors.border,
                    borderWidth: 1,
                  }}
                  key={i}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginHorizontal: 16,
                    }}>
                    <View style={{}}>
                      <Text
                        style={{
                          color:
                            item.title !== 'Rest'
                              ? theme.colors.secondary
                              : '#C7C4DC',
                          fontSize: 16,
                          fontWeight: '500',
                          // marginHorizontal: 16,
                          marginTop: 16,
                          fontFamily: 'Vazirmatn',
                        }}>
                        {findMatchingDay(item.day, daysOfWeek)}
                      </Text>
                      <Text
                        style={{
                          color:
                            item.title !== 'Rest'
                              ? theme.colors.text
                              : '#C7C4DC',
                          fontSize: 14,
                          //fontWeight: '500',
                          marginTop: 8,
                          fontFamily: 'Vazirmatn',
                          //marginHorizontal: 16,
                        }}>
                        {item.title}
                      </Text>
                    </View>

                    <View
                      style={{
                        marginLeft: 16,
                        marginTop: 16,
                      }}>
                      <IconArrowRight color={theme.colors.secondary} />
                    </View>
                  </View>

                  {showDate(item.title) !== undefined && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: 16,
                      }}>
                      <Text
                        style={{
                          borderRadius: 10,
                          color: theme.colors.secondary,
                          fontFamily: 'Vazirmatn',
                          marginBottom: 16,
                        }}>
                        {i18n.t('lastPerformance')}
                      </Text>
                      <Text
                        style={{
                          borderRadius: 10,
                          color: theme.colors.secondary,
                          marginBottom: 16,
                          fontFamily: 'Vazirmatn',
                        }}>
                        {showDate(item.title, userLanguage)}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <View
                  stylw={{
                    marginHorizontal: 16,
                    marginTop: 16,
                  }}
                />
                <Divider
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 20,
                    backgroundColor: 'transparent',
                  }}
                />
                <BannerAdMob key={`ad-${i}`} />
                <Divider
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 20,
                    backgroundColor: theme.colors.border,
                  }}
                />
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //backgroundColor: '#f2f4f5',
    },
    text: {
      fontSize: 10,
      fontWeight: '500',
    },
  });
export default StartSessionIndex;
