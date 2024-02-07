import { Button, useTheme, Divider, Text } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales/index';
import LanguageContext from '../../api/langcontext';
import { useNavigation } from '@react-navigation/native';

import moment from 'moment/moment';
import * as SQLite from 'expo-sqlite';

const db0 = SQLite.openDatabase('totalWeight.db');
function WorkoutList(props) {
  const {
    durationWeeks,
    sessionPerWeek,
    workoutData,
    name,
    setSelectedIndex,
    img,
  } = props;

  const today = moment().format('dddd');
  const tomorrow = moment().add(1, 'days').format('dddd');
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const todayIndex = days.indexOf(today);
  const sortedDays = [...days.slice(todayIndex), ...days.slice(0, todayIndex)];
  const navigation = useNavigation();
  const { data } = props;
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const [workDates, setWorkDates] = useState({});
  const [timestamp, setTimestamp] = useState([]);
  const sorted = workoutData?.sort((a, b) => {
    const dayA = sortedDays.indexOf(a.day);
    const dayB = sortedDays.indexOf(b.day);
    return dayA - dayB;
  });
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  useEffect(() => {
    setWorkDates(
      generateDates(new Date(), durationWeeks, sessionPerWeek, workoutData)
    );
  }, []);

  useEffect(() => {
    const fetchTimestamps = async () => {
      if (workoutData) {
        const uniqueCategories = [...new Set(workoutData.map((d) => d.title))];
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
      }
    };

    fetchTimestamps();
    //saveWorkoutsList();
  }, [workDates]);

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

  const generateDates = (startDate, durationWeeks, daysPerWeek, taskData) => {
    const workDates = {};
    let currentDate = new Date(startDate);

    for (let week = 1; week <= durationWeeks; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDayName = currentDate.toLocaleString('en-US', {
          weekday: 'long',
        });
        const formattedDate = currentDate.toISOString().split('T')[0];
        const dayName = currentDayName.split(',')[0];

        const task = taskData.find((d) => d.day === dayName);
        if (task) {
          if (!workDates[formattedDate]) {
            workDates[formattedDate] = [];
          }
          workDates[formattedDate].push({
            name: task.title,
            date: formattedDate,
          });
        } else {
          if (!workDates[formattedDate]) {
            workDates[formattedDate] = [{ name: 'Rest' }];
          }
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return workDates;
  };

  const CheckIsToday = (dayName) => {
    const todayDayName = moment().format('dddd'); // 'dddd' format gives the full day name
    return todayDayName === dayName;
  };
  const CheckIsTomorrow = (dayName) => {
    const tomorrowDayName = moment().add(1, 'days').format('dddd'); // 'dddd' format gives the full day name
    return tomorrowDayName === dayName;
  };

  const showDate = (category, userLanguage) => {
    moment.locale(userLanguage); // set the locale based on userLanguage
    for (let i = 0; i < timestamp.length; i++) {
      if (timestamp[i].category === category) {
        return moment(timestamp[i].timestamp).endOf('day').fromNow();
        //return moment(timestamp[i].timestamp).format('DD/MM/YYYY');
      }
    }
  };

  const ButtonTitle = ({ item }) => {
    return (
      <View
        style={CheckIsToday(item.day) ? styles.firstItem : styles.otherItem}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('PlanPlus', {
              otherParam: 'anything you want here',
            })
          }
          style={{
            height:
              Platform.OS === 'ios'
                ? Dimensions.get('window').height / 14
                : Dimensions.get('window').height / 11,
            borderWidth: 0.4,
            borderBottomColor: theme.colors.secondary,
            backgroundColor: CheckIsToday(item.day)
              ? theme.colors.secondary
              : theme.colors.primary,
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 10,
              // marginVertical: 5,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: CheckIsToday(item.day) ? 'bold' : 'normal',

                  color: CheckIsToday(item.day)
                    ? theme.colors.primary
                    : theme.colors.secondary,
                }}>
                {CheckIsToday(item.day)
                  ? `${i18n.t('today')}`
                  : `${i18n.t(item.day)}`}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 10,
                color: CheckIsToday(item.day)
                  ? theme.colors.primary
                  : theme.colors.secondary,

                fontWeight: 'bold',
              }}>
              {item?.title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 10,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 8,
                color: CheckIsToday(item.day)
                  ? theme.colors.primary
                  : theme.colors.secondary,
              }}>
              {showDate(item.title) !== undefined &&
                `${i18n.t('lastPerformance')} ${showDate(
                  item.title,
                  userLanguage
                )}`}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      {workoutData ? (
        <View style={{}}>
          <ImageBackground
            style={{
              width: Dimensions.get('window').width - 20,
              height: Dimensions.get('window').height / 7,
              backgroundColor: theme.colors.primary,
              marginVertical: 0,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              alignSelf: 'center',
            }}
            source={{ uri: img }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.colors.primary,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                alignSelf: 'center',
              }}>
              {name}
            </Text>
          </ImageBackground>
          <FlatList
            scrollEnabled={true}
            data={sorted}
            renderItem={({ item }) => <ButtonTitle item={item} />}
            keyExtractor={(item) => item.day}
            numColumns={2}
            style={{
              marginBottom: 20,
            }}
          />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
            width: Dimensions.get('window').width - 20,
            backgroundColor: theme.colors.primary,
          }}>
          <Text
            style={{
              color: theme.colors.secondary,
              fontSize: 12,
              flexWrap: 'wrap',
              marginVertical: 20,
            }}>
            {i18n.t('newPlanText')}
          </Text>

          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 5,
              marginVertical: 20,
            }}
            title={i18n.t('addWorkout')}
            onPress={() => setSelectedIndex(1)}
          />
          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 5,
              marginVertical: 20,
            }}
            title={i18n.t('updateprofile')}
            onPress={() => navigation.navigate('GetUserData')}
          />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  firstItem: {
    width: '100%',
    // other styles for the first item
  },
  otherItem: {
    width: '50%',
    // other styles for the other items
  },
  // any additional styles you need
});
export default WorkoutList;
