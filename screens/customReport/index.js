import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Button, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useTheme } from '@rneui/themed';
import Header from '../../components/header';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Icon } from '@rneui/base';
import { filterByDates } from '../../api/readWorkoutData';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { Iconshare } from '../marketplace/filters/icons';

const db = SQLite.openDatabase('performance.db');
const CustomReport = () => {
  const { userLanguage } = useContext(LanguageContext);
  const navigation = useNavigation();
  const [reportHistoryDates, setReportHistoryDates] = useState();
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const Styles = getStyles(theme);
  const imageRef = useRef();
  const [filteredData, setFilteredData] = useState([]);
  //console.log('filteredData', filteredData);
  // New state variable for filtered data
  const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
  const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD'); // Get tomorrow's date in YYYY-MM-DD format
  const pastSevenDays = moment().subtract(7, 'days').format('YYYY-MM-DD'); // Get the date 7 days ago
  const pastThirtyDays = moment().subtract(30, 'days').format('YYYY-MM-DD'); // Get the date 30 days ago

  const takeScreenshot = () => {
    captureRef(imageRef, {
      format: 'jpg',
      quality: 0.8,
    }).then(
      async (uri) => {
        alert(i18n.t('ScreenshotCaptured'));
        await MediaLibrary.saveToLibraryAsync(uri);
        // Here you can save the image to the gallery or share it
      },
      (error) => console.error('Oops, snapshot failed', error)
    );
  };

  const getResult = async () => {
    try {
      const res = await filterByDates(pastSevenDays, tomorrow);
      setFilteredData(res); // pass the fetched data to setFilteredData function
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    getResult();
  }, []);

  const groupByDateAndCategory = (data) => {
    //console.log('data', data);
    const grouped = {};
    data?.forEach((item) => {
      const date = item?.date || 'Unknown';
      const category = item?.category || 'Unknown';
      const location = item?.location || 'Unknown';
      const performance = item?.performance || 'Unknown';

      if (!grouped[date]) {
        grouped[date] = {};
      }

      if (!grouped[date][category]) {
        grouped[date][category] = [];
      }

      grouped[date][category].push({ location, performance, date });
    });

    return grouped;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        height: Dimensions.get('window').height,
      }}>
      <StatusBar style="auto" />
      <Header title={i18n.t('report')} />
      <ScrollView>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <Button
              title={i18n.t('weeklyReport')}
              buttonStyle={{
                backgroundColor: theme.colors.background,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              titleStyle={{
                color: theme.colors.text,
                fontSize: 12,
                fontWeight: '400',
              }}
              onPress={() => {
                filterByDates(pastSevenDays, tomorrow);
              }}
            />
            <Button
              buttonStyle={{
                backgroundColor: theme.colors.background,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.colors.border,
              }}
              titleStyle={{
                color: theme.colors.text,
                fontSize: 12,
                fontWeight: '400',
              }}
              title={i18n.t('monthlyReport')}
              onPress={() => {
                filterByDates(pastThirtyDays, tomorrow);
              }}
            />
            <Button
              buttonStyle={{
                backgroundColor: theme.colors.background,
                borderRadius: 5,
              }}
              onPress={takeScreenshot}>
              <Iconshare />
            </Button>
          </View>

          <View ref={imageRef}>
            <View
              style={{
                backgroundColor: theme.colors.background,
                margin: 5,
                borderRadius: 10,
                padding: 5,
                flex: 1,
                borderRadius: 10,

                borderColor: theme.colors.secondary,
                // top: Platform.OS === 'ios' ? 30 : 40,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 5,
                  borderRadius: 10,
                  padding: 5,
                }}>
                <Text>{reportHistoryDates}</Text>
              </View>
              {Object.entries(groupByDateAndCategory(filteredData)).map(
                ([date, categories]) => {
                  return (
                    <View key={date} style={Styles.dateContainer}>
                      <Text style={Styles.dateText}>{date}</Text>
                      {Object.entries(categories).map(([category, items]) => {
                        return items.map((item, index) => (
                          <View
                            key={`${category}-${index}`}
                            style={Styles.categoryContainer}>
                            <Text style={Styles.categoryText}>{category}</Text>
                            <View style={Styles.itemContainer}>
                              <Text style={Styles.itemText}>
                                {item.location === 'Gym'
                                  ? i18n.t('gymWorkout')
                                  : i18n.t('homeWorkout')}
                              </Text>
                              <Text style={Styles.itemText}>
                                {item.performance !== 'Unknown'
                                  ? `${i18n.t('performance')}: ${
                                      item.performance
                                    } %`
                                  : null}
                              </Text>
                            </View>
                          </View>
                        ));
                      })}
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    text: { color: theme.colors.text, fontSize: 14, fontWeight: '400' },
    title: { color: theme.colors.text, fontSize: 14 },
    tableText: {
      color: theme.colors.text,
      fontSize: 10,

      flexWrap: 'wrap',
    },
    container: {
      margin: 10,
      //borderRadius: 10,
      padding: 10,
      flex: 1,
      top: Platform.OS === 'ios' ? 30 : 40,
    },
    dateContainer: {
      backgroundColor: theme.colors.background,
      margin: 5,
      borderRadius: 10,
      padding: 5,
    },
    dateText: {
      fontWeight: '400',
      fontSize: 14,
      textAlign: 'center',
      color: theme.colors.text,
    },
    categoryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderRadius: 10,
      padding: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#333',
    },
    itemContainer: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.background,
      padding: 5,
      borderRadius: 5,
      marginVertical: 2,
    },
    itemText: {
      fontSize: 14,
      color: theme.colors.text,
    },
  });

export default CustomReport;
