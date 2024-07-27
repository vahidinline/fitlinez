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
import { useFocusEffect } from '@react-navigation/native';
import checkFreeTrial from '../../api/checkFreeTrial';
import AuthContext from '../../api/context';
import NoWorkoutCard from './noWorkout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DailyReport from '../Calories/dailyReport';
import { LinearGradient } from 'expo-linear-gradient';
import { getNewTasks } from '../../api/getNewTasks';
import StepcounterIndex from '../StepCounter/StepcounterIndex';
import { IconWalking } from '../marketplace/filters/icons';
import { Skeleton } from '@rneui/base';
import BannerAdMob from '../../api/AdMob/BannerComponent';

function HomeIndex() {
  const [refreshing, setRefreshing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  const [status, setStatus] = useState('loading');
  const [taskStatus, setTaskStatus] = useState('idle');
  const [planName, setPlanName] = useState('');
  console.log('status homeindex', status);
  const styles = getStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getNewTasks(userAuth.id, setTaskStatus);
  }, []);

  const onRefresh = useCallback(() => {
    // setRefreshing(true);
    setStatus('loading');
    setTimeout(async () => {
      const result = await getNewTasks(userAuth.id, setTaskStatus);
      if (result) {
        //setModalVisible(true);
        setStatus('hasPlan');
      }
      //setRefreshing(false);
      setStatus('hasPlan');
    }, 3000);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus('loading');
      if (currentPlan === null) {
        setStatus('noPlan');
      } else {
        setStatus('hasPlan');
      }
    }, 2000);
    // Cleanup function to clear the timeout if currentPlan is not null
    return () => {
      clearTimeout(timeout);
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
      const { weeklyPlan, planName } = await readWorkoutData();

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
        }}>
        <HomeHeader i18n={i18n} title={currentPlan?.name} />
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {status === 'loading' && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.colors.background,
              marginHorizontal: 20,
              marginVertical: 20,
              borderRadius: 14,
            }}>
            <Skeleton
              skeletonStyle={{
                borderRadius: 16,
                marginVertical: 10,
                marginHorizontal: 10,
                backgroundColor: theme.colors.background,
              }}
              LinearGradientComponent={LinearGradient}
              animation="wave"
              width={Dimensions.get('window').width / 1.1}
              height={Dimensions.get('window').height / 4}
            />
          </View>
        )}

        {status === 'hasPlan' && (
          <View style={styles.box}>
            <View
              style={{
                flex: 1,
                width: Dimensions.get('window').width,
                marginTop: 0,
                height: Dimensions.get('window').height / 4.3,
                marginBottom: 0,
              }}>
              <CurrentWorkoutCard
                RTL={isRTL}
                title={planName || ''}
                trainer={currentPlan?.creator || ''}
                location={currentPlan?.location || ''}
                userPervilage={userPervilage}
                taskStatus={taskStatus}
                setTaskStatus={setTaskStatus}
                workOutPlan={currentPlan}
              />
            </View>
          </View>
        )}

        {status === 'noPlan' && (
          <View style={styles.box}>
            <View
              style={{
                width: Dimensions.get('window').width,
                marginTop: 30,

                height: Dimensions.get('window').height / 4,
              }}>
              <NoWorkoutCard />
            </View>
          </View>
        )}

        <View style={styles.box}>
          <View
            style={{
              //  backgroundColor: theme.colors.background,
              marginHorizontal: 20,
              borderRadius: 14,
              marginVertical: 0,
              // height: Dimensions.get('window').height / 3.3,
              // top: Dimensions.get('window').height / 8,
            }}>
            <LinearGradient
              colors={['#5B5891', '#3A366F', '#17124a']}
              style={styles.background}
            />

            <View>
              <DailyReport userId={userAuth.id} />
            </View>
          </View>
        </View>
        <View
          style={{
            //  backgroundColor: theme.colors.background,
            marginHorizontal: 20,
            borderRadius: 14,
            marginVertical: 0,

            top: 10,
          }}>
          <LinearGradient
            colors={['#5B5891', '#3A366F', '#17124a']}
            style={styles.background}
          />
          <View
            style={{
              borderBottomColor: 'grey',
              paddingBottom: 5,
              borderBottomWidth: 1,
              paddingHorizontal: 10,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Vazirmatn',
                paddingHorizontal: 10,
                // marginTop: 5,
                color: 'white',
                //direction: 'rtl',
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              {i18n.t('stepcounter')}
            </Text>
          </View>
          <View style={styles.box}>
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
                  backgroundColor: theme.colors.grey2,
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
          v. {process.env.EXPO_PUBLIC_VERSION}
        </Text>
      </ScrollView>

      {/* <View
        style={{
          position: 'absolute',
          bottom: -150,
          //marginHorizontal: 10,
          zIndex: 100,
        }}>
        <BannerAdMob />
      </View> */}
    </SafeAreaView>
  );
}
export default HomeIndex;

const getStyles = (theme) =>
  StyleSheet.create({
    box: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      //backgroundColor: theme.colors.background,
      marginHorizontal: 20,
      marginVertical: 0,

      height: Dimensions.get('window').height / 4,
    },
    container: {
      flex: 1,
      backgroundColor: '#5B5891',
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
