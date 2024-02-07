import { useNavigation } from '@react-navigation/native';
import {
  Button,
  Divider,
  Icon,
  Image,
  ListItem,
  Text,
  useTheme,
} from '@rneui/themed';
import moment from 'moment';
import React from 'react';
import { Alert, Dimensions, ScrollView, View } from 'react-native';
import { Card, List } from 'react-native-paper';
import {
  IconClock,
  IconLevel,
  IconLogo,
  IconRanking,
  IconTimer,
  IconWeight,
} from '../filters/icons';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import Logo from '../../../assets/logo.png';
import AuthContext from '../../../api/context';
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';
import { updateWorkoutPlan } from '../../../api/GetData';
import { Path, Svg } from 'react-native-svg';
import Header from '../../../components/header';

const db = SQLite.openDatabase('packeges.db'); // Open or create the database

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
      //console.log('jsonString', jsonString);
      db.transaction((tx) => {
        tx.executeSql('INSERT INTO packeges (data) VALUES (?);', [jsonString]);
      });

      console.log('new package saved');
    } catch (error) {
      console.log(error);
    }
  };
  // const savePackages = () => {
  //   try {
  //     const jsonString = JSON.stringify(item);
  //     const currentDateTime = new Date().toISOString();

  //     db.transaction((tx) => {
  //       tx.executeSql('INSERT INTO packages (data, timestamp) VALUES (?, ?);', [
  //         jsonString,
  //         currentDateTime,
  //       ]);
  //     });

  //     console.log('Data saved');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
      updateWorkoutPlan(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
      savePackages();
    } else {
      UpgradeAlert();
    }
  };

  const updateWorkoutForTrial = (data) => {
    console.log('updateWorkoutForTrial');
    if (userLevel === 0 && daysSinceRegistration > 14) {
      console.log(
        'userLevel === 0 && daysSinceRegistration < 14',
        daysSinceRegistration
      );
      UpgradeAlert();
    } else {
      updateWorkoutPlan(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

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
            width: Dimensions.get('window').width - 20,
            height: Dimensions.get('window').height / 5,
            alignSelf: 'center',
            marginVertical: 10,
          }}
          source={{ uri: item.image }}
        />
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
              borderWidth: 0.5,
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
          <List.Item
            titleStyle={{ fontSize: 15 }}
            Style={{
              color: theme.colors.secondary,
              fontSize: 15,
            }}
            title="Level"
            description={item.level}
            left={(props) => <IconLevel {...props} />}
          />
          <List.Item
            title="Target"
            description={item.target}
            left={(props) => <IconWeight {...props} />}
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
          <List.Item
            titleStyle={{ fontSize: 15 }}
            Style={{
              color: theme.colors.secondary,
              fontSize: 15,
            }}
            title="Days per week"
            description={item.DaysPerWeek}
            left={(props) => <IconClock {...props} />}
          />
          <List.Item
            title="Duration"
            description={item.duration}
            left={(props) => <IconTimer {...props} />}
          />
        </View>

        <View
          style={
            {
              //marginBottom: Dimensions.get('window').height / 1.5,
            }
          }>
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
                            }}>
                            {exercise.name}
                          </Text>
                          <Text>{exercise.bodyPart}</Text>
                        </View>
                        {/* <View
                          style={{
                            //justifyContent: 'flex-end',
                            top: 10,
                            right: 0,
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
          type="solid"
          onPress={() =>
            premium
              ? updateWorkoutForPremium({ data: item, userId: userId })
              : updateWorkoutForTrial({
                  data: item,
                  userId: userId,
                })
          }
        />
      </View>
    </View>
  );
}

export default PlanItem;
