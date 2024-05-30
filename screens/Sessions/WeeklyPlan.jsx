import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { BottomSheet, Button, Divider } from '@rneui/themed';
import { I18n } from 'i18n-js';
import * as SQLite from 'expo-sqlite';
import { useTheme } from '@rneui/themed';
import RadioButtonfitlinez from '../../components/RadioButtonFitlinez';
import { SessionContext } from '../../api/sessionContext';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import Header from '../../components/header';
import AdditionalIndex from '../additionalData/AdditionalIndex';
import DailyWorkloutListComponent from './dailyWorkloutListComponent';

const db = SQLite.openDatabase('totalWeight.db');

const ButtonsheetComponent = ({
  isVisible,
  setIsVisible,
  setLocSelector,
  locSelector,
  dosomeThing,
  baseLocation,
  i18n,
  isRTL,
}) => {
  const { theme } = useTheme();
  console.log('baseLocation', locSelector);
  let [painStatus, setPainStatus] = useState('hide');
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
              label={i18n.t('gymWorkout')}
              selected={locSelector === 'gym'}
              onSelect={() => setLocSelector('Gym')}
            />
          )}

          {baseLocation === 'home' && (
            <RadioButtonfitlinez
              label={i18n.t('homeWorkout')}
              selected={locSelector === 'home'}
              onSelect={() => setLocSelector('Home')}
            />
          )}
        </View>
        {/* {painStatus !== 'hide' && (
          <View>
            <AdditionalIndex i18n={i18n} isRTL={isRTL} />
          </View>
        )}  */}
        <Button
          disabled={locSelector === '' || locSelector === 'both'}
          onPress={() => dosomeThing(setIsVisible(!isVisible))}
          title={i18n.t('startWorkout')}
          buttonStyle={{
            marginHorizontal: 10,

            borderRadius: 12,

            backgroundColor: theme.colors.button,

            borderRadius: 12,
            marginBottom: 20,
          }}
        />
        <Divider
          style={{
            marginVertical: 20,
            backgroundColor: theme.colors.border,
          }}
        />
        {/* {painStatus === 'hide' && (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              width: Dimensions.get('window').width / 1.1,
              marginBottom: 20,
              borderRadius: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: theme.colors.secondary,
                marginBottom: 0,
                marginTop: 0,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
              }}
              onPress={() => {
                setPainStatus(painStatus === 'hide' ? 'show' : 'hide');
              }}>
              {i18n.t('painGetterTitle')}
            </Text>
          </View>
        )} */}
      </View>
    </BottomSheet>
  );
};

const WeeklyPlan = (props) => {
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
  const { data, title, day, category, baseLocation, planName } =
    props.route.params;
  let isRTL = userLanguage === 'fa' ? true : false;
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [reloadComponent, setReloadComponent] = useState(false); // State variable for reloading the component
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [isLoading, setIsLoading] = useState(false);
  const [filteredWorkoutsList, setFilteredWorkoutsList] = useState([]);
  const [confirmEating, setConfirmEating] = useState(false);
  const [locSelector, setLocSelector] = useState('');

  const estimatedTime = data?.length * 6;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setLocSelector(baseLocation);
  }, [baseLocation]);
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

    navigation.navigate('SessionMainPage', {
      category: title,
      catTname: title,
      workouts: data,
      location: locSelector,
      day: day,
    });
    // timeContext.setWorkoutDuration(newDate);
  }, [navigation, data, locSelector]);

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
      alert(error);
    }
  };
  const updateWorkoutData = useCallback(async () => {
    getWorkOutData();
  }, []);

  const sortedData = [...data].sort((a, b) => {
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
            justifyContent: 'flex-start',
            margin: 10,

            width: Dimensions.get('window').width / 1 - 20,
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

      <View
        style={{
          flexDirection: 'column',

          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: theme.colors.background,
        }}>
        <FlatList
          style={{
            backgroundColor: theme.colors.background,
          }}
          ListFooterComponent={() => {
            return (
              <View>
                <Button
                  onPress={() => {
                    setIsVisible(!isVisible);
                  }}
                  title={i18n.t('start')}
                  titleStyle={{
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                  buttonStyle={{
                    height: 50,
                    width: Dimensions.get('window').width - 20,
                    marginHorizontal: 10,
                    marginVertical: 10,
                    borderRadius: 12,
                    backgroundColor: theme.colors.button,
                  }}
                />
              </View>
            );
          }}
          data={sortedData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return <DailyWorkloutListComponent item={item} i={index} />;
          }}
        />
      </View>

      {isVisible && (
        <ButtonsheetComponent
          isRTL={isRTL}
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
export default WeeklyPlan;
