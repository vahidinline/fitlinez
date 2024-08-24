import React, { useRef, useState, useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  AppState,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { I18n } from 'i18n-js';
import { Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@rneui/themed';
import AuthContext from '../../api/context';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import Header from '../../components/header';
import { userLevelCheck, userStatusCheck } from '../../api/GetData';
import { readWorkoutData } from '../../api/readWorkoutData';
import DaySelectionModal from '../../components/ChangeWorkoutDay/ChangeWorkoutDay';
import { IconEdit, IconSave } from '../marketplace/filters/icons';

require('moment/locale/fa');
require('moment/locale/en-gb');

const StartSessionIndex = () => {
  const { theme } = useTheme();
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const { timeSpent, setTimeSpent } = useContext(TimeSpentContext);
  const [packageId, setPackageId] = useState();
  const [workoutPlan, setWorkoutPlan] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
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
  const [showEdit, setShowEdit] = useState('notActive');
  console.log('showEdit', showEdit);
  const getData = async () => {
    console.log('getData');
    try {
      const { weeklyPlan, planName, location, packageId } =
        await readWorkoutData();
      setWorkoutPlan(weeklyPlan);
      setTitle(planName);
      setLocation(location);
      setPackageId(packageId);
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

  const handleUpdateDay = async (day) => {
    if (showEdit === 'notActive') {
      setShowEdit('active');
    } else {
      setShowEdit('notActive');
    }
    //const res = await getUpdatedWorkoutPlan({ packageId, userId });
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
    { id: 1, nameT: 'دوشنبه', name: 'Monday' },
    { id: 2, nameT: 'سه شنبه', name: 'Tuesday' },
    { id: 3, nameT: 'چهارشنبه', name: 'Wednesday' },
    { id: 4, nameT: 'پنجشنبه', name: 'Thursday' },
    { id: 5, nameT: 'جمعه', name: 'Friday' },
    { id: 6, nameT: 'شنبه', name: 'Saturday' },
    { id: 7, nameT: 'یکشنبه', name: 'Sunday' },
  ];
  const selectedDays = workoutPlan?.map((workout) => workout.dayName);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        // justifyContent: 'center',
        //     alignItems: 'center',
      }}>
      <Header title={title} />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginHorizontal: 16,
          marginVertical: 8,
          width: '90%',
        }}>
        <TouchableOpacity onPress={() => handleUpdateDay()}>
          {showEdit === 'notActive' && <IconEdit size={32} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUpdateDay()}>
          {showEdit === 'active' && <IconSave size={32} />}
        </TouchableOpacity>
      </View>

      <ScrollView>
        {workoutPlan
          ?.sort((a, b) => {
            const indexA = daysOfWeek.findIndex(
              (day) => day.name === a.dayName
            );
            const indexB = daysOfWeek.findIndex(
              (day) => day.name === b.dayName
            );
            return indexA - indexB;
          })
          .map((item, i) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  borderRadius: 16,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  marginHorizontal: 16,
                  height: Dimensions.get('window').height / 10,
                  marginVertical: 8,
                }}
                key={`item-${i}`}>
                <View
                  style={{
                    marginLeft: 10,
                    //marginTop: 10,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    borderLeftWidth: 0,
                    borderWidth: 1,
                    borderColor: theme.colors.grey3,
                    width: '25%',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    // paddingTop: Dimensions.get('window').height / 25,
                  }}>
                  {showEdit === 'active' && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedWorkout(item);
                        setSelectedWorkoutTitle(item.title); // Set the selected workout title

                        setModalVisible(true);
                      }}>
                      <IconEdit />
                    </TouchableOpacity>
                  )}

                  <Text style={{ color: theme.colors.secondary }}>
                    <Text
                      style={{
                        color:
                          item.title !== 'Rest'
                            ? theme.colors.secondary
                            : '#C7C4DC',
                        fontSize: 14,
                        // fontWeight: '500',
                        marginTop: 0,
                        fontFamily: 'Vazirmatn',

                        textAlign: 'center',
                      }}>
                      {findMatchingDay(item.dayName, daysOfWeek)}
                    </Text>
                  </Text>
                </View>
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
                      // justifyContent: 'space-between',
                      // alignItems: 'center',
                      marginHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        color:
                          item.title !== 'Rest'
                            ? theme.colors.secondary
                            : '#C7C4DC',
                        fontSize: 22,
                        justifyContent: 'center',
                        paddingTop: Dimensions.get('window').height / 30,
                        fontWeight: '500',
                        // marginTop: 50,
                        fontFamily: 'Vazirmatn',
                        //center the text
                        textAlign: 'center',
                      }}>
                      {item.title}
                    </Text>
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
        theme={theme}
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
