import React, { useRef, useState, useContext, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useTheme } from '@rneui/themed';
import AuthContext from '../../api/context';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import Header from '../../components/header';
import { userLevelCheck, userStatusCheck } from '../../api/GetData';
import { readWorkoutData } from '../../api/readWorkoutData';
import DaySelectionModal from '../../components/ChangeWorkoutDay/ChangeWorkoutDay';

require('moment/locale/fa');
require('moment/locale/en-gb');

const StartSessionIndex = () => {
  const { theme } = useTheme();
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const { timeSpent, setTimeSpent } = useContext(TimeSpentContext);
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const [timestamp, setTimestamp] = useState([]);
  const [location, setLocation] = useState();
  const [title, setTitle] = useState();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedWorkoutTitle, setSelectedWorkoutTitle] = useState('');
  const userId = userAuth?.id;
  i18n.locale = userLanguage;
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const RTL = userLanguage === 'fa';

  const getData = async () => {
    try {
      const { weeklyPlan, planName, location } = await readWorkoutData();

      // console.log('weeklyPlan', weeklyPlan);
      // console.log('planName', planName);
      // console.log('location', location);
      setWorkoutPlan(weeklyPlan);
      setTitle(planName);
      setLocation(location);
    } catch (error) {
      setWorkoutPlan(null);
      return false;
    }
  };

  useEffect(() => {
    setTimeSpent(0);
  }, []);

  useEffect(() => {
    getData();
  }, []);

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
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const goToWorkOut = (item) => {
    //console.log('item in statrt session', item);

    navigation.navigate('WeeklyPlan', {
      baseLocation: location,
      weeklyPlan: item.exercises,
      title: item.title,
      dayName: item.dayName,
      planName: title,
    });
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
    return null;
  };

  const handleSelectDay = (newDay) => {
    const updatedPlan = workoutPlan.map((workout) =>
      workout === selectedWorkout ? { ...workout, dayName: newDay } : workout
    );
    setWorkoutPlan(updatedPlan);
    setModalVisible(false);
    // Here, you would send the updated plan to the server
    // sendUpdatedPlanToServer(updatedPlan);
  };

  const daysOfWeek = [
    { id: 1, nameT: 'شنبه', name: 'Saturday' },
    { id: 2, nameT: 'یکشنبه', name: 'Sunday' },
    { id: 3, nameT: 'دوشنبه', name: 'Monday' },
    { id: 4, nameT: 'سه شنبه', name: 'Tuesday' },
    { id: 5, nameT: 'چهارشنبه', name: 'Wednesday' },
    { id: 6, nameT: 'پنجشنبه', name: 'Thursday' },
    { id: 7, nameT: 'جمعه', name: 'Friday' },
  ];
  const selectedDays = workoutPlan?.map((workout) => workout.dayName);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title={title} />
      <ScrollView>
        {workoutPlan
          ?.sort((a, b) => {
            const indexA = daysOfWeek.findIndex((day) => day.name === a.day);
            const indexB = daysOfWeek.findIndex((day) => day.name === b.day);
            return indexA - indexB;
          })
          .map((item, i) => {
            return (
              <View
                style={{
                  flexDirection: 'column',
                  borderRadius: 16,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  marginHorizontal: 16,
                  height: 90,
                  marginVertical: 8,
                }}
                key={`item-${i}`}>
                <TouchableOpacity
                  // onPress={() => {
                  //   setSelectedWorkout(item);
                  //   setSelectedWorkoutTitle(item.title); // Set the selected workout title

                  //   setModalVisible(true);
                  // }}
                  style={{ marginLeft: 10, marginTop: 10 }}>
                  <Text style={{ color: theme.colors.secondary }}>
                    {/* <IconEdit /> */}
                    <Text
                      style={{
                        color:
                          item.title !== 'Rest'
                            ? theme.colors.secondary
                            : '#C7C4DC',
                        fontSize: 12,
                        fontWeight: '500',
                        marginTop: 0,
                        fontFamily: 'Vazirmatn',
                      }}>
                      {findMatchingDay(item.dayName, daysOfWeek)}
                    </Text>
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={
                    item.title === 'Rest' ||
                    item.title?.toLowerCase() === 'walking' ||
                    item.title?.toLowerCase() === 'running'
                  }
                  onPress={() =>
                    item.title === 'Rest' ? null : goToWorkOut(item)
                  }
                  style={{
                    flexDirection: 'column',
                    //justifyContent: 'space-between',
                    backgroundColor:
                      item.title !== 'Rest'
                        ? theme.colors.background
                        : theme.colors.disabled,

                    //width: '50%',

                    zIndex: 1000,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // alignItems: 'center',
                      marginHorizontal: 10,
                    }}>
                    <View>
                      <Text
                        style={{
                          color:
                            item.title !== 'Rest'
                              ? theme.colors.text
                              : '#C7C4DC',
                          fontSize: 18,
                          justifyContent: 'center',
                          fontWeight: '500',
                          // marginTop: 50,
                          // fontFamily: 'Vazirmatn',
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
      </ScrollView>
      <DaySelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectDay={handleSelectDay}
        daysOfWeek={daysOfWeek}
        selectedDays={selectedDays}
        workoutTitle={selectedWorkoutTitle} // Pass the selected workout title
        RTL={RTL}
        userId={userId}
      />
    </SafeAreaView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    text: {
      fontSize: 10,
      fontWeight: '500',
    },
  });

export default StartSessionIndex;
