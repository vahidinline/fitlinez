import {
  Agenda,
  AgendaList,
  Calendar,
  CalendarProvider,
  ExpandableCalendar,
  WeekCalendar,
} from 'react-native-calendars';

import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, Text, Avatar, Card } from '@rneui/themed';
import * as SQLite from 'expo-sqlite';
import { I18n } from 'i18n-js';
import i18nt from '../locales/index';
import LanguageContext from '../api/langcontext';
import { useTheme } from '@rneui/themed';

const db = SQLite.openDatabase('totalWeight.db');
const CalendarView = (props) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [workoutData, setWorkoutData] = useState([]);
  const [workoutDate, setWorkoutDate] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  //const [selectedDay, setSelectedDay] = useState('');
  const [filteredData, setFilteredData] = useState([]); // New state variable for filtered data
  const [workOutHistory, setWorkOutHistory] = useState([]);

  const LeftContent = (props) => (
    <Avatar.Icon
      {...props}
      icon="dumbbell"
      style={{ backgroundColor: 'white' }}
      size={50}
    />
  );
  const RightContent = (props) => (
    <Avatar.Icon
      {...props}
      icon="check"
      color="green"
      style={{ backgroundColor: 'white' }}
      size={50}
    />
  );

  const renderItem = (item) => {
    return (
      <TouchableOpacity>
        <View>
          <Text>{item.hour}</Text>
          <Text>{item.duration}</Text>
        </View>
        <Text>{item.title}</Text>
        <View>
          <Button color={'grey'} title={'Info'} />
        </View>
      </TouchableOpacity>
    );
  };

  const generateDates = (startDate, durationWeeks, daysPerWeek, taskData) => {
    const workDates = {};
    let currentDate = new Date(startDate);
    // console.log('taskData: ', taskData); // Debug log

    for (let week = 1; week <= durationWeeks; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDayName = currentDate.toLocaleString('en-US', {
          weekday: 'long',
        });
        const formattedDate = currentDate.toISOString().split('T')[0];
        // console.log('Current Day: ', currentDayName); // Debug log
        const dayName = currentDayName.split(',')[0];

        // Check if the current day is a workday according to taskData
        const task = taskData.find((d) => d.day === dayName);
        // console.log('Task: ', task); // Debug log
        if (task) {
          if (!workDates[formattedDate]) {
            workDates[formattedDate] = [];
          }
          workDates[formattedDate].push({ name: task.title });
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    return workDates;
  };

  // Usage
  const workDates = generateDates(
    new Date('2023-09-21T09:53:58.828Z'), // Start date
    12, // Duration in weeks
    3, // Days per week
    [
      // Task data
      { day: 'Monday', title: 'Upper Body' },
      { day: 'Wednesday', title: 'Lower Body' },
      { day: 'Friday', title: 'Core' },
    ]
  );

  //console.log('workDates', workDates);

  const getData = async () => {
    try {
      // Fetching data from SQLite
      db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT timestamp, category FROM totalWeight',
            [],
            (tx, results) => {
              let data = [];
              for (let i = 0; i < results.rows.length; i++) {
                data.push(results.rows.item(i));
              }

              const dates = data.map((item) => {
                return item.timestamp
                  ? moment(item.timestamp).format('YYYY-MM-DD')
                  : null;
              });
              const marked = dates.reduce((obj, date) => {
                obj[date] = {
                  selected: true,
                  selectedColor: theme.colors.green,
                  dotColor: theme.colors.red,
                  activeOpacity: 0,
                };
                return obj;
              }, {});

              setWorkoutData(data);
              setWorkoutDate(dates);
              setMarkedDates(marked);
            },
            (error) => {
              console.log('Fetch error: ', error);
            }
          );
        },
        (error) => {
          console.log('Transaction error:', error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const gethistorydata = async (date) => {
    const data = await AsyncStorage.getItem('saveDoneWorkOut');
    const parsedData = JSON.parse(data);
    console.log('parsedData', parsedData);
    setWorkOutHistory(parsedData);
  };

  return (
    <SafeAreaView>
      <ScrollView style={{ backgroundColor: theme.colors.primary }}>
        <>
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: theme.colors.primary,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                margin: 10,
                color: theme.colors.secondary,
              }}>
              Workout History
            </Text>

            {/* <Calendar
              style={{
                backgroundColor: theme.colors.primary,
              }}
              markedDates={markedDates}
              onDayPress={(day) => {
                setSelectedDay(day.dateString);
                gethistorydata();
              }}
            /> */}
            {/* <Agenda
              items={workDates}
              showClosingKnob={true}
              showOnlySelectedDayItems={true}
              pastScrollRange={3}
              futureScrollRange={3}
              loadItemsForMonth={(month) => {}}
              selected={new Date()}
              //markedDates={markedDates}
              theme={{
                agendaDayTextColor: theme.colors.green,
                agendaDayNumColor: 'green',
                agendaTodayColor: 'red',
                agendaKnobColor: 'blue',
              }}
              renderItem={(item) => {
                return (
                  <View
                    style={{
                      backgroundColor: theme.colors.secondary,
                      borderRadius: 5,
                      padding: 10,
                      marginRight: 10,
                      marginTop: 17,
                    }}>
                    <Text
                      style={{
                        color: theme.colors.primary,
                        margin: 10,
                        fontSize: 20,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                );
              }}
              renderEmptyDate={() => {
                return <View />;
              }}
              rowHasChanged={(r1, r2) => {
                return r1.text !== r2.text;
              }}
            /> */}

            <CalendarProvider date={new Date()} showTodayButton>
              <ExpandableCalendar markedDates={markedDates} />
              <AgendaList
                renderDay={(day, item) => {
                  if (day) {
                    const date = day.dateString; // Assuming the date comes as "dateString"
                    const isMarked = markedDates[date]?.marked;
                    return (
                      <View>
                        <Text>
                          {isMarked ? '✓' : ''} {day.day}
                        </Text>
                      </View>
                    );
                  }
                }}
                sections={[
                  { title: '2023-09', data: workDates['2023-09-22'] },
                  { title: '2023-10', data: workDates['2023-09-25'] },
                  // ... other sections
                ]}
                renderItem={(item) => {
                  return (
                    <View>
                      <Text>{item.name}</Text>
                    </View>
                  );
                }}
              />
            </CalendarProvider>

            {/* <AgendaList sections={workDates} /> */}

            <ScrollView
              style={{
                top: 30,
                //height: 200,
              }}>
              {workOutHistory?.map((item, i) => {
                const date = moment(item.date).format('YYYY-MM-DD');
                return date === selectedDay ? (
                  <View key={i}>
                    <View key={i}>
                      <Card
                        onPress={() => {
                          gethistorydata();
                        }}>
                        <Card.Title
                          title={item.category}
                          style={{ color: theme.colors.primary }}
                          titleStyle={{ color: theme.colors.primary }}
                          subtitle={item.location ? item.location : null}
                          left={LeftContent}
                          right={RightContent}
                        />

                        <Card.Content>
                          <Text>
                            {item.date
                              ? moment(item.date).format('YYYY-MM-DD')
                              : null}
                          </Text>
                        </Card.Content>
                      </Card>
                    </View>
                  </View>
                ) : null;
              })}
            </ScrollView>
          </View>

          <View>
            {filteredData?.map((item, i) => {
              return (
                <View key={i}>
                  <View key={i}>
                    <Card
                      onPress={() => {
                        gethistorydata();
                      }}>
                      <Card.Title
                        title={item.category}
                        left={LeftContent}
                        right={RightContent}
                      />

                      <Card.Content>
                        <Text>
                          {item.timestamp
                            ? moment(item.timestamp).format('YYYY-MM-DD')
                            : null}
                        </Text>
                      </Card.Content>
                    </Card>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

const Styles = StyleSheet.create({
  text: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  title: { color: '#000', fontSize: 10 },
  tableText: {
    color: '#000',
    fontSize: 10,

    flexWrap: 'wrap',
  },
  container: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    top: Platform.OS === 'ios' ? 30 : 40,
  },
});

export default CalendarView;
