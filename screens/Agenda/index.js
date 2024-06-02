import { Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions, FlatList, StyleSheet } from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { IconRest, IconWeight } from '../marketplace/filters/icons';

function WorkoutAgenda(props) {
  const { durationWeeks, sessionPerWeek, workoutData } = props;
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

  const generateDates = (startDate, taskData) => {
    const workDates = {};
    let currentDate = new Date(startDate);

    for (let week = 1; week <= 12; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDayName = currentDate.toLocaleString('en-US', {
          weekday: 'long',
        });
        const formattedDate = currentDate.toISOString().split('T')[0];
        const dayName = currentDayName.split(',')[0];

        const task = taskData?.find((d) => d.day === dayName);
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

  const ButtonTitle = ({ item }) => {
    const itemDate = new Date(item.year, item.month, parseInt(item.day, 10));
    itemDate.setHours(0, 0, 0, 0);

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const isPastDay = itemDate < currentDate;
    const isToday = itemDate.getTime() === currentDate.getTime();

    return (
      <View
        key={item.id}
        style={{
          flexDirection: 'column',
        }}>
        <View
          style={{
            top: 10,
            height: Dimensions.get('window').height / 9,
            width: Dimensions.get('window').width / 9,
            marginHorizontal: 6,
            marginVertical: 4,
            borderRadius: 16,
            backgroundColor: isPastDay
              ? theme.colors.grey3
              : theme.colors.lightPrimary,
            borderWidth: 1,
            borderColor: isToday ? theme.colors.secondary : theme.colors.border,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 15,
              //fontWeight: 'bold',
              color: isToday ? theme.colors.secondary : theme.colors.text,
            }}>
            {item.day}
          </Text>

          <Text
            style={{
              fontSize: 15,
              // fontWeight: 'bold',
              color: isToday ? theme.colors.secondary : theme.colors.text,
            }}>
            {item.title}
          </Text>
          {item.task !== 'Rest' ? (
            <IconWeight size={24} />
          ) : (
            <IconRest size={24} color={theme.colors.secondary} />
          )}
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

  return (
    <FlatList
      data={getWeekData()}
      renderItem={({ item }) => <ButtonTitle item={item} />}
      keyExtractor={(item) => item.day}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}

export { WorkoutAgenda };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    flexDirection: 'column',
  },
  text: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  label: {
    fontSize: 22,
    textAlign: 'center',
    //fontWeight: 'bold',
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  animatedBorder: {
    height: 8,
    width: 64,
    backgroundColor: 'tomato',
    borderRadius: 20,
  },
});
