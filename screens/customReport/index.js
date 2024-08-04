import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useTheme } from '@rneui/themed';
import { userWorkoutHistory } from '../../api/workoutSessionTracker';
import AuthContext from '../../api/context';
import { IconFire } from '../marketplace/filters/icons';
import convertToPersianNumbers from '../../api/PersianNumber';
import { Skeleton } from '@rneui/base';
import { LinearGradient } from 'react-native-svg';
import ShareWorkoutSession from './share';

const CustomReport = () => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const Styles = getStyles(theme);
  const [status, setStatus] = useState('idle');
  const [shareStatus, setShareStatus] = useState('idle');
  const imageRef = useRef();
  const [filteredData, setFilteredData] = useState([]);
  const { userAuth } = useContext(AuthContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const userId = userAuth.id;
  const RTL = userLanguage === 'fa';

  const handleHistoryData = async () => {
    setStatus('loading');
    try {
      const res = await userWorkoutHistory(userId);
      setStatus('success');
      // console.log('history result', res);
      setFilteredData(res);
    } catch (error) {
      console.log('error', error);
      setStatus('noData');
    }
  };

  useEffect(() => {
    handleHistoryData();
  }, []);

  const handleShowItem = (item) => {
    // console.log('item', item);
    setSelectedItem(item);
    setShareStatus('share');
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        height: Dimensions.get('window').height,
      }}>
      <StatusBar style="auto" />
      {/* <Header title={i18n.t('report')} /> */}
      {shareStatus === 'idle' && (
        <ScrollView>
          <View>
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
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    margin: 5,
                    borderRadius: 10,
                    padding: 5,
                  }}>
                  <Text style={Styles.title}>
                    {i18n.t('workoutHistorydesc')}
                  </Text>

                  {status === 'noData' && (
                    <Text style={Styles.title}>{i18n.t('noWorkouts')}</Text>
                  )}
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

                  {filteredData
                    ?.sort(
                      (a, b) =>
                        new Date(b.sessionStartDate) -
                        new Date(a.sessionStartDate)
                    )
                    .filter((item) => item.sessionStatus === 'completed')
                    .map((item, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            margin: 5,
                            borderRadius: 10,
                            padding: 5,
                            borderColor: theme.colors.border,
                            borderWidth: 1,
                          }}>
                          <TouchableOpacity
                            onPress={() => {
                              handleShowItem(item);
                            }}>
                            <Text style={Styles.date}>
                              {moment(item.sessionStartDate).format(
                                'YYYY-MM-DD'
                              )}
                            </Text>
                            {item.sessionEndDate != null && (
                              <Text style={Styles.date}>
                                {convertToPersianNumbers(
                                  moment(item.sessionEndDate).diff(
                                    moment(item.sessionStartDate),
                                    'minutes'
                                  ),
                                  RTL
                                )}{' '}
                                {i18n.t('minute')}
                              </Text>
                            )}

                            <Text style={Styles.title}>{item.dayName}</Text>

                            {item.burnedCalories != null && (
                              <Text style={Styles.calories}>
                                {`${i18n.t(
                                  'burnedCalories'
                                )} ${convertToPersianNumbers(
                                  item.burnedCalories.toFixed(0),
                                  RTL
                                )}`}{' '}
                                {i18n.t('calories')} <IconFire />
                              </Text>
                            )}
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      {shareStatus === 'share' && (
        <ShareWorkoutSession
          setShareStatus={setShareStatus}
          shareStatus={shareStatus}
          item={selectedItem}
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    text: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '400',

      fontFamily: 'Vazirmatn',
    },
    title: {
      color: theme.colors.text,
      fontSize: 18,
      fontFamily: 'Vazirmatn',
      //fontWeight: 'bold',
      textAlign: 'center',
    },
    date: {
      color: theme.colors.text,
      fontSize: 12,
      fontWeight: '400',
      fontFamily: 'Vazirmatn',
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
    subtitle: {
      fontWeight: '400',
      fontSize: 14,
      textAlign: 'center',
      color: theme.colors.text,
      fontFamily: 'Vazirmatn',
    },
    calories: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
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
    status: {
      position: 'absolute',
      top: 20,
      right: 0,
      transform: [{ rotate: '45deg' }],
      color: 'white',
    },
    itemText: {
      fontSize: 14,
      color: theme.colors.text,
    },
  });

export default CustomReport;
