import { Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { IconRest, IconWeight } from '../marketplace/filters/icons';
import { useNavigation } from '@react-navigation/native';

function WorkoutAgenda(props) {
  const { workoutData } = props; // Assuming workoutData is provided via props
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const navigation = useNavigation();

  // Get the week data with today centered as the 4th item
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

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to midnight

    // Calculate the dates with today in the middle (4th position)
    const week = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i - 3); // Offset by -3 to +3 around today

      const dayName = fullDayNames[date.getDay()];
      const formattedDate = date.toISOString().split('T')[0];

      // Find the task for the current day
      const task = workoutData?.find((d) => d.day === dayName) || {
        title: 'Rest',
      };

      return {
        day: String(date.getDate()).padStart(2, '0'),
        month: date.getMonth(),
        year: date.getFullYear(),
        title: weekDays[date.getDay()],
        task: task.title, // Assign the task title
        isToday: date.getTime() === today.getTime(),
      };
    });

    return week;
  }

  const ButtonTitle = ({ item }) => {
    return (
      <View
        key={`${item.year}-${item.month}-${item.day}`}
        style={{
          flexDirection: 'column',
        }}>
        <TouchableOpacity
          // onPress={() => {
          //   item.isToday
          //     ? navigation.navigate('DailyTaskIndex', {
          //         screen: 'DailyTaskIndex',
          //       })
          //     : null;
          // }}
          style={{
            top: item.isToday ? 0 : 5,
            height: item.isToday ? 100 : 90,
            width: !item.isToday ? Dimensions.get('window').width / 9 : 60,
            marginHorizontal: item.isToday ? 2 : 6,
            marginVertical: 4,
            borderRadius: item.isToday ? 16 : 10,
            backgroundColor: item.isToday
              ? theme.colors.secondary
              : theme.colors.white,

            borderWidth: item.isToday ? 2 : 1,
            borderColor: theme.colors.primary,
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 15,
              color: item.isToday
                ? theme.colors.primary
                : theme.colors.secondary,
            }}>
            {item.day}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: item.isToday
                ? theme.colors.primary
                : theme.colors.secondary,
            }}>
            {item.title}
          </Text>
          {item.title !== 'Rest' ? (
            <IconWeight
              size={24}
              color={item.isToday ? theme.colors.white : theme.colors.secondary}
            />
          ) : (
            <IconRest
              size={24}
              color={item.isToday ? theme.colors.white : theme.colors.secondary}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={getWeekData()}
      renderItem={({ item }) => <ButtonTitle item={item} />}
      keyExtractor={(item) => `${item.year}-${item.month}-${item.day}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      initialScrollIndex={3} // Start with today as the center item
      getItemLayout={(data, index) => ({
        length: Dimensions.get('window').width / 7,
        offset: (Dimensions.get('window').width / 7) * index,
        index,
      })}
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
