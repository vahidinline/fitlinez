import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions, FlatList } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useNavigation } from '@react-navigation/native';
import { IconRest, IconWeight } from '../marketplace/filters/icons';

function WorkoutAgenda(props) {
  const { durationWeeks, sessionPerWeek, workoutData } = props;
  //console.log('workoutData', workoutData);
  const navigation = useNavigation();
  const { data } = props;
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const [workDates, setWorkDates] = useState({});

  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  useEffect(() => {
    setWorkDates(
      generateDates(new Date(), durationWeeks, sessionPerWeek, workoutData)
    );
  }, []);

  const generateDates = (startDate, durationWeeks, daysPerWeek, taskData) => {
    //console.log('taskData', startDate, durationWeeks, daysPerWeek, taskData);
    const workDates = {};
    let currentDate = new Date(startDate);
    //console.log('taskData: ', taskData); // Debug log

    for (let week = 1; week <= 12; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDayName = currentDate.toLocaleString('en-US', {
          weekday: 'long',
        });
        const formattedDate = currentDate.toISOString().split('T')[0];
        // console.log('Current Day: ', currentDayName); // Debug log
        const dayName = currentDayName.split(',')[0];

        // Check if the current day is a workday according to taskData
        const task = taskData?.find((d) => d.day === dayName);
        //  console.log('Task: ', task); // Debug log
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
    // console.log('workDates', workDates);
    return workDates;
  };

  //console.log('workDates', workDates);
  const currentDay = new Date().getDate();

  //console.log('currentDay', currentDay);

  const ButtonTitle = ({ item }) => {
    // console.log('item', item);
    const itemDate = new Date(item.year, item.month, parseInt(item.day, 10));
    itemDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const isPastDay = itemDate < currentDate;
    const isToday = itemDate.getTime() === currentDate.getTime();

    //console.log('day', day);
    return (
      <View
        key={item.id}
        style={{
          flexDirection: 'column',
        }}>
        <View
          style={{
            top: 10,
            height: Dimensions.get('window').height / 12,
            width: Dimensions.get('window').width / 8.5,
            marginHorizontal: 5,
            marginVertical: 4,
            borderRadius: 16,
            backgroundColor: isPastDay
              ? theme.colors.lightPrimary
              : theme.colors.background,
            borderWidth: 1,
            borderColor: isToday ? theme.colors.secondary : theme.colors.border,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            stlye={{
              fontSize: 14,
              fontSize: 10,
              fontWeight: 'bold',
              color: theme.colors.text,
            }}>
            {item.day}
          </Text>
          <Text
            stlye={{
              fontSize: 24,
              fontSize: 10,
              color: theme.colors.grey1,
            }}>
            {item.title}
          </Text>
          {item.task !== 'Rest' ? <IconWeight /> : <IconRest />}
        </View>
      </View>
    );
  };

  function getWeekData() {
    const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const fullDayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const getDayTitle = (day) => {
      const fullDayName = fullDayNames[weekDays?.indexOf(day)];
      return workoutData?.find((d) => d.day === fullDayName)?.title || 'Rest';
    };

    const today = new Date();
    const currentDayOfWeek = today.getDay();

    // Calculate the date of the most recent Monday
    const mostRecentMonday = new Date(today);
    mostRecentMonday.setDate(
      today.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1)
    );

    const week = Array.from({ length: 7 }, (_, i) => {
      const dayOfWeek = (mostRecentMonday.getDay() + i) % 7;
      const date = new Date(mostRecentMonday);
      date.setDate(mostRecentMonday.getDate() + i);
      return {
        day: String(date.getDate()).padStart(2, '0'),
        month: date.getMonth(),
        year: date.getFullYear(),
        title: weekDays[dayOfWeek],
        task: getDayTitle(weekDays[dayOfWeek]),
      };
    });

    return week;
  }

  // function getWeekData() {
  //   const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  //   const today = new Date();
  //   const currentDayOfWeek = today.getDay();

  //   // Calculate the date of the most recent Monday
  //   const mostRecentMonday = new Date(today);
  //   console.log('mostRecentMonday', mostRecentMonday);
  //   mostRecentMonday.setDate(
  //     today.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1)
  //   );

  //   const week = Array.from({ length: 7 }, (_, i) => {
  //     const dayOfWeek = (mostRecentMonday.getDay() + i) % 7;
  //     const date = new Date(mostRecentMonday);
  //     date.setDate(mostRecentMonday.getDate() + i);
  //     return {
  //       day: String(date.getDate()).padStart(2, '0'),
  //       title: weekDays[dayOfWeek],
  //     };
  //   });

  //   return week;
  // }

  return (
    <FlatList
      data={getWeekData()}
      renderItem={({ item }) => <ButtonTitle item={item} />}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}

export { WorkoutAgenda };
