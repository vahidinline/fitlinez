import Bugsnag from '@bugsnag/expo';
Bugsnag.start();
import { NavigationContainer } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import AuthContext from './api/context';
import AuthStorage from './api/storage';
import ErrorBoundary from 'react-native-error-boundary';
import InitialNavigation from './navigation/initialNavigation';
import MsgContext from './api/messageContext';
import { StatusBar } from 'expo-status-bar';
import LanguageContext from './api/langcontext';
import { DefaultTheme, SecondTheme } from './theme/defaultTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeSpentProvider } from './api/TimeSpentContext';
import HomeNavigator from './navigation/HomeNavigator';
import initDB from './api/db';
import * as SQLite from 'expo-sqlite';
import * as Updates from 'expo-updates';
import { Button, Text, ThemeProvider, useTheme } from '@rneui/themed';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Dimensions, Linking, SafeAreaView, View } from 'react-native';
import { userLevelCheck } from './api/GetData';
import { ThemeContext } from './api/themeContext';
import 'react-native-gesture-handler';
import { SessionProvider } from './api/sessionContext';
import { UnitProvider } from './api/unitContext';
import { PaperProvider } from 'react-native-paper';
import UserPrivilegeContext from './api/userPrivilegeContext';
import checkFreeTrial from './api/checkFreeTrial';
import { init } from '@amplitude/analytics-react-native';
import { logEvent } from '@amplitude/analytics-react-native';
import { forceSolveError, clearAllAsyncCache } from './api/forceSolveError';

// wherever you want to log an event
logEvent('using app');
const setupAmplitude = async () => {
  await init('2dbde109138c224a29c59085770205c', {
    serverZone: 'EU',
  });
};

setupAmplitude();

const errorHandler = (error, stackTrace) => {
  /* Log the error to an error reporting service */
  Bugsnag.notify(error);
  Bugsnag.notify(stackTrace);
  console.log('error', error);
  console.log('stackTrace', stackTrace);
  //console.log('error', error);
};

const db = SQLite.openDatabase('totalWeight.db');

export default function App() {
  const [userAuth, setUserAuth] = useState();
  const [userPrivilege, setUserPrivilege] = useState();
  const [msg, setMsg] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(DefaultTheme);
  const [userLanguage, setUserLanguage] = useState('en');
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const [routeNamesHistory, setRouteNamesHistory] = useState([]);
  const { theme } = useTheme();
  const toggleTheme = () => {
    setCurrentTheme(currentTheme === DefaultTheme ? SecondTheme : DefaultTheme);
  };

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        console.log('No updates available');
      }
    } catch (error) {
      // You can also add an alert() here if needed for your purposes
      console.log(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  useEffect(() => {
    userLevelCheck(userAuth, setUserAuth);
  }, []);

  useEffect(() => {
    // Only call checkFreeTrial if userAuth is not empty/null/undefined
    if (userAuth) {
      checkFreeTrial(userAuth);

      // assuming checkFreeTrial returns a boolean
      let isFreeTrial = checkFreeTrial(userAuth);

      // Now, call your setUserPrivilege function according to the free trial check.
      setUserPrivilege(isFreeTrial ? true : false);
    }
  }, [userAuth]); // This ensures the effect is run whenever userAuth changes

  useEffect(() => {
    Notifications.setBadgeCountAsync(msg);
  }, [msg]);

  useEffect(() => {
    const getStoredLanguage = async () => {
      try {
        const value = await AsyncStorage.getItem('userLanguage');
        if (value !== null) {
          setUserLanguage(value);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getStoredLanguage();
  }, []);

  useEffect(() => {
    const storeLanguage = async () => {
      try {
        await AsyncStorage.setItem('userLanguage', userLanguage);
      } catch (e) {
        console.error(e);
      }
    };

    storeLanguage();
  }, [userLanguage]);

  const restoreToken = async () => {
    const token = await AuthStorage.getToken();
    if (!token) return;
    try {
      const user = token;
      setUserAuth(JSON.parse(user));
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    restoreToken();
  }, []);

  useEffect(() => {
    initDB();
    //deleteAllTables();
  }, []);

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        // Handle the notification as you see fit
      });

    // This listener is fired whenever a user taps on a notification
    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // Handle the notification response as you see fit
      });

    return () => {
      // Clean up the listeners when the component is unmounted
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  }, []);

  useEffect(() => {
    // Restore navigation state
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem('NAVIGATION_STATE');
        const state = JSON.parse(savedStateString);

        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    restoreState();
  }, []);

  if (!isReady) {
    return null;
  }

  const ErrorFallback = () => (
    <SafeAreaView>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 200,
        }}>
        Something happened!
      </Text>

      <Button
        buttonStyle={{
          marginTop: 20,
          marginHorizontal: 20,
          width: Dimensions.get('window').width - 40,
          borderRadius: 10,
          justifyContent: 'center',
        }}
        color="primary"
        onPress={() => forceSolveError(setUserAuth)}
        size="lg">
        Log out
      </Button>
      <Button
        buttonStyle={{
          marginTop: 20,
          marginHorizontal: 20,
          width: Dimensions.get('window').width - 40,
          borderRadius: 10,
          justifyContent: 'center',
          backgroundColor: '#FFF3DA',
        }}
        titleStyle={{ color: '#5B5891' }}
        color="primary"
        onPress={() => clearAllAsyncCache()}
        size="lg">
        clear cache
      </Button>
    </SafeAreaView>
  );

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={ErrorFallback}>
      <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
        <AuthContext.Provider value={{ userAuth, setUserAuth }}>
          <MsgContext.Provider value={{ msg, setMsg }}>
            <LanguageContext.Provider value={{ userLanguage, setUserLanguage }}>
              <ThemeProvider theme={DefaultTheme}>
                <UnitProvider>
                  <TimeSpentProvider>
                    <SessionProvider>
                      <NavigationContainer
                        initialState={initialState}
                        onStateChange={(state) => {
                          AsyncStorage.setItem(
                            'NAVIGATION_STATE',
                            JSON.stringify(state)
                          );
                          const routeNames = state.routes.map(
                            (route) => route.name
                          );
                          setRouteNamesHistory(routeNames);
                        }}>
                        <StatusBar
                          style={{
                            backgroundColor: '#FCF8FF',
                          }}
                        />
                        {userAuth ? (
                          userAuth.isActive ? (
                            <PaperProvider>
                              <UserPrivilegeContext.Provider
                                value={{ userPrivilege, setUserPrivilege }}>
                                <HomeNavigator />
                              </UserPrivilegeContext.Provider>
                            </PaperProvider>
                          ) : (
                            // <HomeNavigator />
                            <InitialNavigation />
                            // <LoginIndex />
                          )
                        ) : (
                          <InitialNavigation />
                        )}
                        {/* <TestComponent /> */}
                      </NavigationContainer>
                    </SessionProvider>
                  </TimeSpentProvider>
                </UnitProvider>
              </ThemeProvider>
            </LanguageContext.Provider>
          </MsgContext.Provider>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
}
