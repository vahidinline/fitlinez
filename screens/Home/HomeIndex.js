import { Skeleton, Text, useTheme } from '@rneui/themed';
import React, { useCallback, useContext } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import HomeHeader from './homeHeader';
import { WorkoutAgenda } from '../Agenda';
import { useEffect, useState } from 'react';
import { currentPalnPercentage } from '../../api/readWorkoutData';
import { readWorkoutData } from '../../api/readWorkoutData';
import CurrentWorkoutCard from './CurrentWorkoutCard';
import { getPackages } from '../../api/GetData';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import checkFreeTrial from '../../api/checkFreeTrial';
import AuthContext from '../../api/context';
import { ActivityIndicator } from 'react-native-paper';
import NoWorkoutCard from './noWorkout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserAccess } from '../../api/checkTestAccess';
import StartSessionIndexHome from '../Sessions/StartSessionIndexHome';
import DailyReport from '../Calories/dailyReport';
import { Button } from '@rneui/base';
import FitlinezLoading from '../../components/FitlinezLoading';

function HomeIndex() {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentPlanAsync, setCurrentPlanAsync] = useState(null);
  const [isPlanAssigned, setIsPlanAssigned] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const { theme } = useTheme();
  const [packages, setPackages] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const [userWorkoutData, setUserWorkoutData] = useState([]);
  const [planStartDate, setPlanStartDate] = useState(null);
  const { userAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState('loading');
  console.log('status', status);
  const navigator = useNavigation();
  const [userTestAccess, setUserTestAccess] = useState(
    checkUserAccess(userAuth.id)
  );
  const BACKGROUND_FETCH_TASK = 'background-fetch';
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      await syncMessages();
      return BackgroundFetch.Result.NewData;
    } catch (err) {
      return BackgroundFetch.Result.Failed;
    }
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus('loading');
      if (currentPlan === null) {
        setStatus('noPlan');
        setLoading(false);
        setIsPlanAssigned(false);
      } else {
        setStatus('hasPlan');
        setLoading(false);
        setIsPlanAssigned(true);
      }
    }, 5000);
    // Cleanup function to clear the timeout if currentPlan is not null
    return () => {
      clearTimeout(timeout);
      setLoading(false);
    };
  }, [currentPlan]);

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only
      startOnBoot: true, // android only
    });
  }

  const [userPervilage, setUserPervilage] = useState(false);

  const checkUserPervilage = () => {
    setUserPervilage(checkFreeTrial(userAuth.date));
  };

  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true), getUserWorkoutData();
      getData();
      getPackagesData();
      checkUserPervilage();
      return () => {
        setLoading(false);
      };
    }, [])
  );

  const getPlanFromAsyncStorage = async () => {
    await AsyncStorage.getItem('workoutsList').then((value) => {
      // alert('workoutsList');
      if (value !== null) {
        const workoutsList = JSON.parse(value);

        setCurrentPlanAsync(workoutsList[0]);
      } else {
        //alert('workoutsList without data');
      }
    });
  };
  useEffect(() => {
    getPlanFromAsyncStorage();
  }, []);

  const getUserWorkoutData = async () => {
    currentPalnPercentage().then((data) => {
      setUserWorkoutData(data);
    });
  };

  const getData = async () => {
    try {
      const { workoutPlanData, totalSession, addedDateTime } =
        await readWorkoutData();

      setCurrentPlan(workoutPlanData);
      setTotalSessions(totalSession);
      setPlanStartDate(addedDateTime);
    } catch (error) {
      setCurrentPlan(null);
      setLoading(false);
      return false;
    }
  };

  const getPackagesData = async () => {
    const result = await getPackages();
    setPackages(result);
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}>
      {status === 'loading' && <FitlinezLoading />}
      <View
        style={{
          marginTop: Dimensions.get('window').height / 10,
          marginBottom: 0,
          zIndex: 100,
        }}>
        <HomeHeader
          planStartDate={planStartDate}
          data={userWorkoutData?.data}
          i18n={i18n}
          title={currentPlan?.name}
        />
        {status === 'hasPlan' && (
          <View
            style={{
              height: Dimensions.get('window').height / 7,
              marginTop: 20,
            }}>
            <WorkoutAgenda
              data={currentPlan}
              workoutData={currentPlan?.data?.map(({ day, title }) => ({
                day,
                title,
              }))}
            />
          </View>
        )}
      </View>

      <ScrollView
        style={{
          flex: 1,
          // marginTop: currentPlan ? Dimensions.get('window').height / 7 : 0,
        }}>
        {status === 'hasPlan' && (
          <View
            style={{
              width: Dimensions.get('window').width,
              marginTop: 10,
              height: Dimensions.get('window').height / 15,
              //zIndex: 100,
              marginBottom: Dimensions.get('window').height / 6,
            }}>
            <CurrentWorkoutCard
              title={currentPlan?.name || ''}
              trainer={currentPlan?.creator || ''}
              totalSessions={totalSessions || 0}
              location={currentPlan?.location || ''}
              userPervilage={userPervilage}
            />
          </View>
        )}
        {status === 'noPlan' && (
          <View
            style={{
              width: Dimensions.get('window').width,
              marginTop: 30,

              marginBottom: Dimensions.get('window').height / 6,
            }}>
            <NoWorkoutCard packages={packages} userPervilage={userPervilage} />
          </View>
        )}

        {/* {userTestAccess ? (
          <View
            style={{
              position: 'absolute',
              top: 200,
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            <ChatBotIndex isRTL={isRTL} theme={theme} />
          </View>
        ) : ( */}
        {/* <>
          {packages?.length === 0 && (
            <View
              style={{
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                marginHorizontal: 30,
                marginBottom: 20,
                borderRadius: 20,
              }}>
              <Skeleton
                skeletonStyle={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 20,
                  borderWidth: 0.5,
                  borderColor: theme.colors.border,
                }}
                animation="pulse"
                width={Dimensions.get('window').width / 1 - 20}
                height={Dimensions.get('window').height / 3}
              />
            </View>
          )}
          {packages
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((item) => (
              <CardItem key={item._id} item={item} />
            ))}
        </> */}
        {/* )} */}

        <StartSessionIndexHome
          title={currentPlan?.name || ''}
          trainer={currentPlan?.creator || ''}
          totalSessions={totalSessions || 0}
          location={currentPlan?.location || ''}
          userPervilage={userPervilage}
        />
        <View
          style={{
            backgroundColor: theme.colors.background,
            marginHorizontal: 20,
            borderRadius: 14,
            marginVertical: 10,
          }}>
          <DailyReport userId={userAuth.id} />

          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,
              borderRadius: 12,
              width: Dimensions.get('window').width / 2,
              height: Dimensions.get('window').height / 20,
              alignSelf: 'center',
              marginBottom: 20,
            }}
            titleStyle={{
              color: theme.colors.primary,
            }}
            onPress={() => {
              navigator.navigate('Calories');
            }}>
            {i18n.t('calorieTracker')}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
export default HomeIndex;
