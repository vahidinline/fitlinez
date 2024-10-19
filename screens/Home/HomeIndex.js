import { Text, useTheme } from '@rneui/themed';
import React, { useCallback, useContext } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import HomeHeader from './homeHeader';
import { useEffect, useState } from 'react';
import { readWorkoutData } from '../../api/readWorkoutData';
import CurrentWorkoutCard from './CurrentWorkoutCard';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import checkFreeTrial from '../../api/checkFreeTrial';
import AuthContext from '../../api/context';
import NoWorkoutCard from './noWorkout';
import DailyReport from '../CaloriesCounter/dailyReport';
import { LinearGradient } from 'expo-linear-gradient';
import { getNewTasks } from '../../api/getNewTasks';
import StepcounterIndex from '../StepCounter/StepcounterIndex';
import { IconWalking } from '../marketplace/filters/icons';
import HasWorkoutCard from './hasWorkout';
import convertToPersianNumbers from '../../api/PersianNumber';
import Flashing from '../../components/flashing';
import { TouchableOpacity } from 'react-native';
import { SessionContext } from '../../api/sessionContext';

function HomeIndex() {
  const { sessionData, setSessionData } = useContext(SessionContext);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [status, setStatus] = useState('hasPlan');
  const [taskStatus, setTaskStatus] = useState('idle');
  const [planName, setPlanName] = useState('');
  const styles = getStyles(theme);
  const navigator = useNavigation();
  const RTL = userLanguage === 'fa';
  const onRefresh = useCallback(() => {
    setTaskStatus('loading');
    setTimeout(async () => {
      const result = await getNewTasks(userAuth.id, setTaskStatus);
      if (result) {
      }
    }, 3000);
  }, []);

  useEffect(() => {
    setStatus('loading');
    if (currentPlan === null) {
      setStatus('noPlan');
    } else {
      setStatus('hasPlan');
    }

    // Cleanup function to clear the timeout if currentPlan is not null
    return () => {
      setStatus('idle');
    };
  }, [currentPlan]);

  const [userPervilage, setUserPervilage] = useState(false);

  const checkUserPervilage = () => {
    setUserPervilage(checkFreeTrial(userAuth.date));
  };

  useFocusEffect(
    useCallback(() => {
      setStatus('loading');
      getData();

      checkUserPervilage();
      return () => {
        setStatus('idle');
      };
    }, [])
  );

  const getData = async () => {
    try {
      const { weeklyPlan, planName } = await readWorkoutData(navigator);

      setCurrentPlan(weeklyPlan);
      setPlanName(planName);
      setStatus('hasPlan');
    } catch (error) {
      setCurrentPlan(null);
      setStatus('noPlan');
      return false;
    }
  };

  return (
    <SafeAreaView>
      <View
        style={{
          marginTop: Platform.OS === 'ios' ? 0 : 50,
          marginBottom: 0,
          zIndex: 100,

          //  backgroundColor: theme.colors.secondary,
        }}>
        <HomeHeader i18n={i18n} title={currentPlan?.name} />
      </View>

      <ScrollView
        style={
          {
            // backgroundColor: theme.colors.secondary,
          }
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <LinearGradient
          colors={[
            theme.colors.primary,
            theme.colors.secondary,
            theme.colors.primary,
          ]}
          style={styles.background}
        />
        {/* {status === 'loading' && <FitlinezLoading />} */}

        {status === 'hasPlan' && (
          // <CurrentWorkoutCard
          //   RTL={isRTL}
          //   title={planName || ''}
          //   trainer={currentPlan?.creator || ''}
          //   location={currentPlan?.location || ''}
          //   userPervilage={userPervilage}
          //   taskStatus={taskStatus}
          //   setTaskStatus={setTaskStatus}
          //   workOutPlan={currentPlan}
          // />
          <HasWorkoutCard
            title={planName || ''}
            location={currentPlan?.location || ''}
          />
        )}

        {status === 'noPlan' && (
          <View style={styles.box}>
            <View
              style={{
                // width: Dimensions.get('window').width,
                marginTop: 30,
                marginBottom: 20,
                height: Dimensions.get('window').height / 4,
              }}>
              <NoWorkoutCard />
            </View>
          </View>
        )}
        <View style={styles.box}>
          <DailyReport userId={userAuth.id} />
        </View>

        <View
          style={{
            marginHorizontal: 20,
            borderRadius: 14,
            marginVertical: 0,

            //top: 10,
          }}>
          <LinearGradient
            colors={['#5B5891', '#3A366F', '#17124a']}
            //style={styles.background}
          />
          <View
            style={
              {
                // borderBottomColor: theme.colors.border,
                // paddingBottom: 5,
                // borderBottomWidth: 1,
                // paddingHorizontal: 10,
                // marginTop: 10,
              }
            }>
            {/* <Text
              style={{
                fontSize: 14,
                fontFamily: 'Vazirmatn',
                paddingHorizontal: 10,

                color: theme.colors.text,

                textAlign: 'center',
                justifyContent: 'center',
              }}>
              {i18n.t('stepcounter')}
            </Text> */}
          </View>
          <View
            style={[
              styles.container,
              {
                height:
                  Platform.OS === 'ios'
                    ? Dimensions.get('window').height / 5
                    : Dimensions.get('window').height / 4,
              },
            ]}>
            {Platform.OS === 'ios' ? (
              <StepcounterIndex />
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: 20,

                  height: Dimensions.get('window').height / 4,
                }}>
                <View>
                  <IconWalking size={72} />
                </View>
                <Text style={styles.text}>
                  {i18n.t('stepCounterNotAvailable')}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text
          style={{
            color: theme.colors.text,
            fontSize: 8,
            fontFamily: 'Vazirmatn',
            textAlign: 'center',
            marginVertical: 10,
          }}>
          {' '}
          {i18n.t('v')}{' '}
          {convertToPersianNumbers(process.env.EXPO_PUBLIC_VERSION, RTL)}
        </Text>
      </ScrollView>

      {sessionData.length !== 0 && (
        <TouchableOpacity
          onPress={() => navigator.navigate('SessionNavigator')}
          style={{
            position: 'absolute',
            bottom: 0,
            // flexDirection: 'column',
            //marginHorizontal: 10,

            zIndex: 1000,
            backgroundColor: theme.colors.secondary,
            width: Dimensions.get('window').width / 1.1,
            marginHorizontal: 20,
            borderRadius: 14,
            height: 80,
            padding: 10,

            // flexWrap: 'wrap',
            flexShrink: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.text,
              {
                textAlign: 'center',
              },
            ]}>
            {i18n.t('runningSessiontitle')}
          </Text>
          <Text
            style={[
              styles.text,
              {
                textAlign: 'center',
              },
            ]}>
            {i18n.t('runningSessionbody')} <Flashing />
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
export default HomeIndex;

const getStyles = (theme) =>
  StyleSheet.create({
    box: {
      // flex: 1,
      borderTopColor: theme.colors.border,
      borderTopWidth: 1,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: theme.colors.background,
      marginHorizontal: 20,
      marginTop: 25,
      width: Dimensions.get('window').width / 1.1,
      //height: Dimensions.get('window').height / 4,
    },
    container: {
      flex: 1,

      justifyContent: 'center',
      alignItems: 'center',
      //marginHorizontal: 20,
      padding: 30,
      borderRadius: 14,
      //width: Dimensions.get('window').width / 1.1,
      marginVertical: 0,
      // minHeight: Dimensions.get('window').height / 5,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 14,
    },
    text: {
      color: theme.colors.white,
      fontSize: 12,
      fontFamily: 'Vazirmatn',
    },
  });
