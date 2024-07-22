import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BottomSheet, Button } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { getWorkOutData } from '../../api/GetData';
import * as SQLite from 'expo-sqlite';
import Header from '../header';
import { useTheme } from '@rneui/themed';
import { SessionContext } from '../../api/sessionContext';
import RadioButtonfitlinez from '../RadioButtonFitlinez';

const db = SQLite.openDatabase('totalWeight.db');

const ButtonsheetComponent = ({
  isVisible,
  setIsVisible,
  setLocSelector,
  locSelector,
  dosomeThing,
  baseLocation,
  i18n,
}) => {
  console.log('baseLocation', baseLocation);
  const { theme } = useTheme();
  return (
    <BottomSheet modalProps={{}} isVisible={isVisible}>
      <View
        style={{
          backgroundColor: theme.colors.background,
          paddingHorizontal: 20,
          // height: 300,
          borderRadius: 16,
          paddingBottom: 20,
        }}>
        <View
          style={
            {
              //marginBottom: 20,
            }
          }>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: theme.colors.secondary,
              marginBottom: 20,
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {i18n.t('startWorkoutTitle')}
          </Text>
          {baseLocation === 'both' && (
            <React.Fragment>
              <RadioButtonfitlinez
                label={i18n.t('gymWorkout')}
                selected={locSelector === 'Gym'}
                onSelect={() => setLocSelector('Gym')}
              />
              <RadioButtonfitlinez
                label={i18n.t('homeWorkout')}
                selected={locSelector === 'Home'}
                onSelect={() => setLocSelector('Home')}
              />
            </React.Fragment>
          )}

          {baseLocation === 'gym' && (
            <RadioButtonfitlinez
              label="Gym Workout"
              selected={locSelector === 'Gym'}
              onSelect={() => setLocSelector('Gym')}
            />
          )}

          {baseLocation === 'home' && (
            <RadioButtonfitlinez
              label="Home Workout"
              selected={locSelector === 'Home'}
              onSelect={() => setLocSelector('Home')}
            />
          )}
        </View>

        <Button
          onPress={() => dosomeThing(setIsVisible(!isVisible))}
          title={'Done'}
          buttonStyle={{
            marginHorizontal: 10,

            borderRadius: 12,

            backgroundColor: theme.colors.button,

            borderRadius: 12,
            marginBottom: 20,
          }}
        />
      </View>
    </BottomSheet>
  );
};

const StartPlan = (props) => {
  const retrieveAndCalculateSum = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'SELECT * FROM totalWeight WHERE title = ?;',
          [title],
          (tx, results) => {
            if (results.rows.length > 0) {
              const title = results.rows.item(0).totalWeightSum;
              setTotalWeightSum(sum || 0);
            } else {
              return 0;
            }
          },
          (tx, error) => {
            console.log('Error executing SQL query:', error);
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
      },
      () => {
        console.log('Transaction completed successfully');
      }
    );
  };

  useEffect(() => {
    retrieveAndCalculateSum();
  }, []);
  const { setSessionData } = useContext(SessionContext);
  const { userLanguage } = useContext(LanguageContext);
  const { data, title, day, category, baseLocation } = props.route.params;

  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [reloadComponent, setReloadComponent] = useState(false); // State variable for reloading the component
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [isLoading, setIsLoading] = useState(false);
  const [subs, setSubs] = useState([]);
  const [filteredWorkoutsList, setFilteredWorkoutsList] = useState([]);
  const [confirmEating, setConfirmEating] = useState(false);
  const [locSelector, setLocSelector] = useState('Gym');
  const estimatedTime = filteredWorkoutsList?.length * 6;
  const [isVisible, setIsVisible] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // getWorkOutData();
    saveWorkoutsList();

    setReloadComponent(true);

    setTimeout(() => {
      setRefreshing(false);
      setReloadComponent(false);
    }, 2000);
  }, []);

  let newDate = new Date();
  //   const timeContext = useContext(TimeContext);

  const dosomeThing = useCallback(() => {
    setSessionData([]);
    // saveUserData();

    navigation.navigate('ListOfExercises', {
      category: title,
      catTname: title,
      workouts: filteredWorkoutsList,
      location: locSelector,
      day: day,
    });
    // timeContext.setWorkoutDuration(newDate);
  }, [navigation, filteredWorkoutsList, locSelector]);

  const saveWorkoutsList = async () => {
    try {
      const filteredWorkoutsList =
        data?.filter(
          (workout) =>
            workout.loc === locSelector || workout.loc.toLowerCase() === 'both'
        ) || [];

      setFilteredWorkoutsList(filteredWorkoutsList);
      setIsLoading(false);
    } catch (error) {
      console.log('Error in saving workouts list', error);
    }
  };
  const updateWorkoutData = useCallback(async () => {
    getWorkOutData();
  }, []);

  const sortedData = [...filteredWorkoutsList].sort((a, b) => {
    if (a.type === 'warmup' && b.type !== 'warmup') {
      return -1; // "warmup" appears before other types
    } else if (a.type !== 'warmup' && b.type === 'warmup') {
      return 1; // Other types appear after "warmup"
    } else if (a.type === 'cooldown' && b.type !== 'cooldown') {
      return 1; // Other types appear before "cooldown"
    } else if (a.type !== 'cooldown' && b.type === 'cooldown') {
      return -1; // "cooldown" appears after other types
    } else {
      return a.order - b.order;
    }
  });

  // const toggleOverlay = () => {
  //   setVisible(!visible);
  // };

  useEffect(() => {
    saveWorkoutsList();
  }, [locSelector, reloadComponent]);
  // console.log(workoutsList);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      <Header title={title} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 16,
            justifyContent: 'center',
            justifyContent: 'flex-start',
            margin: 10,

            width: Dimensions.get('window').width / 2 - 20,
          }}>
          <Text
            style={{
              color: theme.colors.grey2,
              fontSize: 14,
              fontWeight: '500',
              margin: 20,
            }}>
            {i18n.t('exercices')}
          </Text>
          <Text
            style={{
              color: '#3F3B6C',
              fontSize: 15,
              fontWeight: 'bold',
              marginBottom: 20,
              marginLeft: 20,
            }}>
            {filteredWorkoutsList.length}{' '}
            {locSelector === 'Gym'
              ? i18n.t('gymWorkout')
              : i18n.t('homeWorkout')}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 16,
            justifyContent: 'flex-start',
            margin: 10,

            width: Dimensions.get('window').width / 2 - 20,
          }}>
          <Text
            style={{
              color: theme.colors.grey2,

              fontSize: 14,
              fontWeight: '500',
              marginBottom: 20,

              margin: 20,
            }}>
            {i18n.t('estimatedTime')}
          </Text>
          <Text
            style={{
              color: '#3F3B6C',
              fontSize: 15,
              fontWeight: 'bold',
              marginBottom: 20,
              marginLeft: 20,
            }}>
            {estimatedTime} {i18n.t('minute')}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{ flexDirection: 'column' }}>
          {sortedData.map((item, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  // backgroundColor: theme.colors.white,
                  //borderRadius: 20,
                  marginBottom: 10,
                  width: Dimensions.get('window').width - 20,
                  marginHorizontal: 10,
                  height: 60,
                  borderRadius: 16,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                }}>
                <View
                  style={{
                    width: 35,
                    height: 35,
                    backgroundColor: theme.colors.secondary2,
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,
                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      color: theme.colors.secondary,
                      //padding: 10,
                    }}>
                    {i + 1}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 10,

                    marginLeft: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '500',
                      // marginBottom: 20,
                      //justifyContent: 'flex-start',

                      color: theme.colors.secondary,
                      //padding: 10,
                    }}>
                    {item.name}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View></View>
      {isVisible && (
        <ButtonsheetComponent
          i18n={i18n}
          baseLocation={baseLocation}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          setLocSelector={setLocSelector}
          setConfirmEating={setConfirmEating}
          confirmEating={confirmEating}
          locSelector={locSelector}
          dosomeThing={dosomeThing}
        />
      )}
    </SafeAreaView>
  );
};
const styles = (theme) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      // backgroundColor: theme.colors.primary,
      marginTop: StatusBar.currentHeight || 0,
      //backgroundColor: '#fff',
    },
    item: {
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 6,
    },
    title: {
      fontSize: 32,
      color: '#fff',
    },
    subtitle: {
      fontSize: 12,
      color: '#fff',
    },
    box: { fontSize: 15, color: '#fff' },
  });
export default StartPlan;
