import { useNavigation } from '@react-navigation/native';
import { Button, Divider, Text, useTheme } from '@rneui/themed';
import moment from 'moment';
import React from 'react';
import { Alert, Dimensions, ScrollView, View } from 'react-native';
import { Card } from 'react-native-paper';
import {
  IconClock,
  IconHomeFocused,
  IconLevel,
  IconLogo,
  IconTimer,
  IconWeight,
  Iconstar,
} from '../filters/icons-';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import AuthContext from '../../../api/context';
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';
import { updateWorkoutPlan } from '../../../api/GetData';
import Header from '../../../components/header';

const db = SQLite.openDatabase('packeges.db'); // Open or create the database

const SingleItem = ({ title, sub, icon }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        //flexDirection: 'row',

        marginVertical: 10,
        marginHorizontal: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // alignItems: 'center',
          width: Dimensions.get('window').width / 2.3,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon}
          <Text
            style={{
              color: theme.colors.grey,
              fontSize: 16,
              fontWeight: '500',
              marginHorizontal: 10,
              fontFamily: 'Vazirmatn',
            }}>
            {title}
          </Text>
        </View>
      </View>

      <Text
        style={{
          color: theme.colors.secondary,
          fontSize: 18,
          fontFamily: 'Vazirmatn',
          fontWeight: '500',
          //marginHorizontal: 10,
        }}>
        {sub}
      </Text>
    </View>
  );
};

function PlanItem({ route }) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  i18n.locale = userLanguage;
  const premium = item?.premium;
  const { data } = route.params.item;
  const { item } = route.params;
  const today_date = moment();
  const userDateRegister = userAuth.date;
  const realDate = moment(date).format('DD/MM/YYYY');
  const userLevel = userAuth.level;
  const userId = userAuth.id;
  const date = item.date;
  const daysSinceRegistration = moment(today_date).diff(
    userDateRegister,
    'days'
  );
  const addedDateTime = new Date().toISOString();

  const savePackages = () => {
    try {
      const jsonString = JSON.stringify({ item, addedDateTime });
      updateWorkoutPlan(item, addedDateTime, userId);
      db.transaction((tx) => {
        tx.executeSql('INSERT INTO packeges (data) VALUES (?);', [jsonString]);
      });

      console.log('new package saved');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS packeges (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, data TEXT);'
      );
    });
  }, []);

  const categorizedData = (Array.isArray(data) ? data : []).reduce(
    (acc, item) => {
      if (item && item.day && Array.isArray(item.data)) {
        if (!acc[item.day]) {
          acc[item.day] = [];
        }
        acc[item.day].push(...item.data);
      }
      return acc;
    },
    {}
  );

  const UpgradeAlert = () => {
    Alert.alert(
      i18n.t('upgrade'),
      i18n.t('upgradeMessage'),
      [
        {
          text: i18n.t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: i18n.t('upgrade'),
          onPress: () => navigation.navigate('Upgrade'),
        },
      ],
      { cancelable: false }
    );
  };

  const updateWorkoutForPremium = (data) => {
    if (userLevel === 4) {
      savePackages();

      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home' }],
      // });
    } else {
      UpgradeAlert();
    }
  };

  const updateWorkoutForTrial = (data) => {
    if (userLevel === 0 && daysSinceRegistration > 14) {
      console.log(
        'userLevel === 0 && daysSinceRegistration < 14',
        daysSinceRegistration
      );
      UpgradeAlert();
    } else {
      updateWorkoutPlan(data, addedDateTime, userId);
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home' }],
      // });

      savePackages();
    }
  };

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get('window').height,
        paddingTop: 40,
        backgroundColor: theme.colors.background,
        //paddingBottom: 20,
      }}>
      <ScrollView>
        <Header title={item.name} />

        <Card.Cover
          style={{
            width: Dimensions.get('window').width - 30,
            height: Dimensions.get('window').height / 5,
            alignSelf: 'center',
            marginVertical: 10,
          }}
          source={{ uri: item.image }}
        />
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 16,
            marginTop: 10,
            marginHorizontal: 10,
          }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              borderBottomColor: theme.colors.secondary,
              borderBottomWidth: 0.3,
              marginHorizontal: 10,
              marginVertical: 10,

              //backgroundColor: theme.colors.background,
            }}>
            <View
              style={{
                borderRadius: 10,
                //borderWidth: 0.5,
                borderColor: theme.colors.border,
                marginBottom: 20,
                padding: 5,
              }}>
              <IconLogo height={50} width={100} />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.colors.secondary,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
                fontFamily: 'Vazirmatn',
                //left: Dimensions.get('window').width / 3,
                marginHorizontal: 10,
                marginVertical: 10,
                top: 10,
              }}>
              {item.creator}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 0,
              marginHorizontal: 10,
            }}>
            <SingleItem
              title={i18n.t('level')}
              sub={item.level}
              icon={<IconLevel />}
            />
            <SingleItem
              title={i18n.t('target')}
              sub={item.target}
              icon={<IconWeight />}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: Dimensions.get('window').width - 20,
              marginTop: 20,
              marginBottom: 0,
              marginHorizontal: 10,
            }}>
            <SingleItem
              title={i18n.t('duration')}
              sub={`${item.duration} ${i18n.t('week')}`}
              icon={<IconTimer />}
            />
            <SingleItem
              title={i18n.t('daysperweek')}
              sub={`${item.DaysPerWeek} ${i18n.t('daysinweek')} `}
              icon={<IconClock />}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: Dimensions.get('window').width - 20,
              marginTop: 20,
              marginBottom: 0,
              marginHorizontal: 10,
            }}>
            <SingleItem
              title={i18n.t('date')}
              sub={moment(date).format('DD/MM/YYYY')}
              icon={<IconTimer />}
            />
            {/* <SingleItem
              title={i18n.t('rate')}
              sub={`${item.star} `}
              icon={<Iconstar size={32} color={theme.colors.gold} />}
            /> */}
            <SingleItem
              title={i18n.t('location')}
              sub={`${item.location === 'both' ? 'Home/Gym' : item.location} `}
              icon={<IconHomeFocused size={32} color={theme.colors.gold} />}
            />
          </View>
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: 16,
            marginTop: 10,
            marginHorizontal: 10,
            //marginBottom: Dimensions.get('window').height / 1.5,
          }}>
          {Object.keys(categorizedData).map((day) => (
            <View key={day}>
              <View
                style={{
                  //backgroundColor: theme.colors.background,
                  height: 100,
                  alignContent: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    //fontWeight: 'bold',
                    fontSize: 20,
                    textAlign: 'center',
                    marginVertical: 10,
                    color: theme.colors.secondary,
                    fontFamily: 'Vazirmatn',
                  }}>
                  {day}
                </Text>
                <Divider
                  style={{
                    height: 0.5,
                    backgroundColor: theme.colors.secondary,
                    marginHorizontal: 10,
                    marginVertical: 10,
                  }}
                />
              </View>
              {categorizedData[day].map((exercise, i) => (
                <View key={i}>
                  {categorizedData[day].length > 1 && (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'justify-between',
                        marginVertical: 5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
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
                            marginHorizontal: 10,
                          }}>
                          <Text
                            style={{
                              color: theme.colors.button,
                              //marginHorizontal: 10,
                              marginVertical: 10,
                              fontSize: 10,
                              fontFamily: 'Vazirmatn',
                            }}>
                            {i + 1}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'column',
                            top: 10,
                          }}>
                          <Text
                            style={{
                              color: theme.colors.secondary,
                              fontSize: 16,
                              fontWeight: '500',
                              fontFamily: 'Vazirmatn',
                            }}>
                            {exercise?.name}
                          </Text>
                          <Text>{exercise?.bodyPart}</Text>
                        </View>
                        {/* <View
                          style={{
                            justifyContent: 'flex-end',
                            top: 10,
                            left: Dimensions.get('window').width / 3,
                            position: 'absolute',
                          }}>
                          {exercise.loc === 'Both' ? (
                            <Icon8 />
                          ) : exercise.loc === 'Home' ? (
                            <IconHomeFocused />
                          ) : (
                            <IconWeight />
                          )}
                        </View> */}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: theme.colors.white,
        }}>
        <Button
          containerStyle={{
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 8,
            backgroundColor: theme.colors.primary,
          }}
          color={theme.colors.button}
          title={i18n.t('addtoyourplan')}
          titleStyle={{
            fontFamily: 'Vazirmatn',
          }}
          type="solid"
          onPress={() => savePackages(item, userId)}
          //   premium
          //     ? updateWorkoutForPremium({ data: item, userId: userId })
          //     : updateWorkoutForTrial({
          //         data: item,
          //         userId: userId,
          //       })
          // }
        />
      </View>
    </View>
  );
}

export default PlanItem;
