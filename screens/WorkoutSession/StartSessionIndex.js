import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  AppState,
  TouchableOpacity,
} from 'react-native';
import { I18n } from 'i18n-js';
import { Text } from '@rneui/themed';
import { useContext, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@rneui/themed';
import AuthContext from '../../api/context';
import { TimeSpentContext } from '../../api/TimeSpentContext';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { IconArrowRight } from '../marketplace/filters/icons';
import Header from '../../components/header';
import { userLevelCheck, userStatusCheck } from '../../api/GetData';
import moment from 'moment';

require('moment/locale/fa');
require('moment/locale/en-gb');

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
        const title = JSON.parse(value).data.name;
        setTitle(title);
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
    saveWorkoutsList();
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
            const indexA = a.day;
            const indexB = b.day;

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
                        {item.day}
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
                </TouchableOpacity>
                <View
                  stylw={{
                    marginHorizontal: 16,
                    marginTop: 16,
                  }}
                />
                {/* <Divider
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 20,
                    backgroundColor: 'transparent',
                  }}
                /> */}
                {/* <BannerAdMob key={`ad-${i}`} /> */}
                {/* <Divider
                  style={{
                    marginVertical: 20,
                    marginHorizontal: 20,
                    backgroundColor: theme.colors.border,
                  }}
                /> */}
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
