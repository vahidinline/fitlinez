import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthContext from '../../api/context';
import {
  checkVersion,
  getWorkOutData,
  userLevelCheck,
  userStatusCheck,
} from '../../api/GetData';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import checkFreeTrial from '../../api/checkFreeTrial';
import { Button, useTheme } from '@rneui/themed';
import getPackages from '../../api/getLatestPackage';
import HomeHeader from './homeHeader';
import * as SQLite from 'expo-sqlite';
import AlertUser from './Alert';
import HomeAssess from './homeAssess';
import HomeTop from './HomeTop';
import Upgrade from './upgrade';
import PushApp from '../../components/push';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { syncMessages } from '../../api/notification';
import MarketPlaceIndex from '../marketplace/MarketPlaceIndex';
const db1 = SQLite.openDatabase('packeges.db');

// trackEvent('Screen View', { name: 'HomePage' });

const HomePage = (props) => {
  const BACKGROUND_FETCH_TASK = 'background-fetch';
  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    try {
      await syncMessages();
      return BackgroundFetch.Result.NewData;
    } catch (err) {
      return BackgroundFetch.Result.Failed;
    }
  });
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const [woroutCategories, setWorkoutCategories] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const userId = userAuth.id;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const Userplatform = Platform.OS;
  const currentVersion = '7.0.7.2';
  const userLocation = userAuth.location;
  const userLevel = userAuth.level;
  const [freeTiral, setFreeTrial] = useState('false');
  const currentPlanRef = useRef();

  const checkTrial = async () => {
    const regDate = userAuth.date;
    const isFreeTrialActive = await checkFreeTrial(regDate);

    if (isFreeTrialActive) {
      isFreeTrialActive <= 0
        ? setFreeTrial('Free trial has ended')
        : setFreeTrial('Free trial is active');
    } else {
      setFreeTrial('Free trial has ended');
    }
  };

  // useEffect(() => {
  //   //console.log('inside useeffect');
  //   if (currentPlan.length === 0 && currentPlan === undefined) {
  //     //console.log('inside if');
  //     setOpenAlert(true);
  //   }
  // }, [currentPlan]);

  async function checkStatusAsync() {
    const status = await BackgroundFetch.getStatusAsync();
    console.log('BackgroundFetch status:', status);
    return;
    switch (status) {
      case BackgroundFetch.Status.Restricted:
      case BackgroundFetch.Status.Denied:
        console.log('Background execution is disabled');
        return false;

      default:
        return true;
    }
  }

  useEffect(() => {
    // checkStatusAsync();
    if (currentPlan) {
      currentPlanRef.current = currentPlan;
      // Now currentPlanRef.current holds the value of currentPlan
    }
  }, [currentPlan]);

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15, // 15 minutes
      stopOnTerminate: false, // android only
      startOnBoot: true, // android only
    });
  }

  useEffect(() => {
    registerBackgroundFetchAsync();
  }, []);

  useFocusEffect(
    useCallback(() => {
      userLevelCheck(userAuth, setUserAuth);
      userStatusCheck(userAuth, setUserAuth);
      checkVersion(currentVersion, Userplatform, userLocation);
      checkTrial(userAuth.date);
      syncMessages();

      return () => {
        // alert('Screen was unfocused');
      };
    }, [])
  );
  useEffect(() => {
    const getAllCategories = async () => {
      const result = await getPackages();
      setWorkoutCategories(result);
    };
    getAllCategories();
  }, []);

  //remove async storage with keyname
  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@firstUsage').then(() => {
        console.log('removed');
      });
    } catch (e) {
      // remove error
    }
  };

  const checkFirstTimeUser = async () => {
    try {
      const value = await AsyncStorage.getItem('@firstUsage');
      if (value === null) {
        // First time user, set a flag in AsyncStorage
        await AsyncStorage.setItem('@firstUsage', 'true');

        getWorkOutData(userId);
      } else {
        // Returning user, set the flag to false
        await AsyncStorage.setItem('@firstUsage', 'false');
      }
    } catch (error) {
      // Handle AsyncStorage errors if needed
    }
  };

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const insets = useSafeAreaInsets();
  const [reload, setReload] = useState(true);
  const navigation = useNavigation();
  const [selectedIndex, setSelectedIndex] = useState(1);
  const today = new Date().toISOString().substring(0, 10);

  useEffect(() => {
    userStatusCheck(userAuth, setUserAuth);
  }, [userAuth]);

  useEffect(() => {
    setReload(true);
  }, [reload]);

  const buttons = [
    {
      title: `${i18n.t('beginner')}`,
      onPress: () => handleButtonPress('Beginner'),
    },
    {
      title: `${i18n.t('intermediate')}`,
      onPress: () => handleButtonPress('Intermediate'),
    },
    {
      title: `${i18n.t('advanced')}`,
      onPress: () => handleButtonPress('Advanced'),
    },
  ];

  const readWorkoutData = () => {
    try {
      db1.transaction((tx) => {
        tx.executeSql('SELECT * FROM packeges;', [], (_, result) => {
          const rows = result.rows._array;
          rows.forEach((row) => {
            const dataObject = JSON.parse(row.data);
            setCurrentPlan(dataObject);
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    readWorkoutData();
  }, []);

  return (
    <SafeAreaView
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.primary,
      }}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={true}
      />
      {openAlert && (
        <AlertUser setOpenAlert={setOpenAlert} openAlert={openAlert} />
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 0,
        }}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <HomeAssess />
        </View>
        <HomeHeader />
      </View>

      <View
        style={{
          overflow: 'hidden',
        }}>
        <HomeTop
          currentPlan={currentPlan}
          woroutCategories={woroutCategories}
        />
      </View>
    </SafeAreaView>
  );
};
const getStyles = (theme) =>
  StyleSheet.create({
    title: {
      fontSize: 25,
      marginLeft: 0,
      // marginTop: 30,
      fontWeight: 'bold',
      color: theme.colors.secondary,
    },
    secondHeaderTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      shadowColor: theme.colors.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.9,
    },
  });

export default HomePage;
