import Bugsnag from '@bugsnag/expo';
Bugsnag.start();
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AuthContext from './api/context';
import AuthStorage from './api/storage';
import InitialNavigation from './navigation/initialNavigation';
import MsgContext from './api/messageContext';
import { StatusBar } from 'expo-status-bar';
import LanguageContext from './api/langcontext';
import { DefaultTheme, SecondTheme } from './theme/defaultTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeSpentProvider } from './api/TimeSpentContext';
import HomeNavigator from './navigation/HomeNavigator';
import * as Updates from 'expo-updates';
import { Button, Text, ThemeProvider } from '@rneui/themed';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Alert, View } from 'react-native';
import { userLevelCheck } from './api/GetData';
import { ThemeContext } from './api/themeContext';
import 'react-native-gesture-handler';
import { SessionProvider } from './api/sessionContext';
import { UnitProvider } from './api/unitContext';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import UserPrivilegeContext from './api/userPrivilegeContext';
import { trackUserData } from './api/tracker';
import appUpdateTrack from './api/appUpdateTrack';
import { useFonts } from 'expo-font';
import i18nt from './locales';
import { I18n } from 'i18n-js';
import FlashMessage from 'react-native-flash-message';

const errorHandler = (error, stackTrace) => {
  /* Log the error to an error reporting service */
  Bugsnag.notify(error);
  Bugsnag.notify(stackTrace);
  //console.log('error', error);
  //console.log('stackTrace', stackTrace);
  //console.log('error', error);
};

// const db = SQLite.openDatabase('totalWeight.db');

export default function App() {
  const [userAuth, setUserAuth] = useState();
  const [userPrivilege, setUserPrivilege] = useState();
  const [msg, setMsg] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(DefaultTheme);
  const [userLanguage, setUserLanguage] = useState('en');
  const i18n = new I18n(i18nt);
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const [routeNamesHistory, setRouteNamesHistory] = useState([]);
  const [status, setStatus] = useState('idle');

  //clean all asyncstorage
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      // clear error
    }
  };

  useEffect(() => {
    clearAll();
  }, []);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === DefaultTheme ? SecondTheme : DefaultTheme);
  };

  useEffect(() => {
    trackUserAnalytics();
  }, [userAuth]);

  const trackUserAnalytics = async () => {
    try {
      const res = await trackUserData(userAuth, 'App started');
    } catch (error) {
      // console.log(error);
    }
  };

  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); // Reload to apply the update
        appUpdateTrack(userAuth?.userId); // Your custom tracking function
      } else {
        //console.log('No updates available');
      }
    } catch (error) {
      //console.log(`Error fetching latest Expo update: ${error}`);
    }
  }

  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  useEffect(() => {
    userLevelCheck(userAuth, setUserAuth);
  }, []);

  useEffect(() => {
    Notifications.setBadgeCountAsync(msg);
  }, [msg]);

  const [fontsLoaded, fontError] = useFonts({
    Vazirmatn: require('./assets/fonts/Vazirmatn-Regular.ttf'),
  });

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

  // Display a loading indicator or splash screen while fonts are loading or app is initializing
  if (!fontsLoaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);

  const onError = (event) => {
    // callback will only run for errors caught by boundary
  };

  const ErrorView = ({ clearError }) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          //  backgroundColor: theme.colors.background,
        }}>
        <Text
          style={{
            color: '#000',
            fontSize: 18,
            fontFamily: 'Vazirmatn',
            marginVertical: 30,
          }}>
          An error occurred in the app
        </Text>

        <Button onPress={clearError} title="Reset" />
      </View>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorView} onError={onError}>
      <FlashMessage position="top" />
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
