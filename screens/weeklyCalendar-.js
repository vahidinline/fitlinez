import { useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { Icon } from '@rneui/themed';
import { I18n } from 'i18n-js';
import * as WebBrowser from 'expo-web-browser';
import { Button, Card, Text } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthStorage from '../api/storage';
import { SafeAreaView } from 'react-native';
import moment from 'moment';
import * as _ from 'lodash';
import AuthContext from '../api/context';
import i18nt from '../locales';
import LanguageContext from '../api/langcontext';
import review from '../components/review';

const WeeklyCal = () => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const userLocation = userAuth.location;
  const userDateRegister = userAuth.date;
  const userStripeId = userAuth.stripeID;
  const [monthlyPlan, setMonthlyPlan] = useState(null);
  const [donePlan, setDonePlan] = useState([]);
  const currentDate = new Date();
  const yesterdayDate = new Date(currentDate);
  yesterdayDate.setDate(currentDate.getDate() - 1);
  const tommorowDate = new Date(currentDate);
  tommorowDate.setDate(currentDate.getDate() + 1);
  const todayDate = new Date(currentDate);
  todayDate.setDate(currentDate.getDate());
  const [modalVisible, setModalVisible] = useState(false);
  const today_date = moment();
  const yesterday = moment(today_date).subtract(5, 'day');
  const nextWeek = moment(today_date).add(7, 'days');
  const daysSinceRegistration = moment(today_date).diff(
    userDateRegister,
    'days'
  );

  const handleReview = async () => {
    const userReview = await AsyncStorage.getItem('userReview');
    if (userReview === null) {
      setModalVisible(true);
    } else {
      return null;
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await AsyncStorage.getItem('monthlyPlan');
      setMonthlyPlan(JSON.parse(data));
    };
    getData();
    handleReview();
  }, []);

  const [monthName, setMonthName] = useState();

  useEffect(() => {
    var date = moment().subtract('month').startOf('month').format('MMMM');
    setMonthName(date);
  }, []);

  useEffect(() => {
    const getReview = async () => {
      const data = await AsyncStorage.getItem('userReview');
      if (data !== null) {
        console.log('data', data);
      }
    };
    getReview();
  }, []);

  const [today, setToday] = useState(new Date().getDate());
  const navigation = useNavigation();
  const setWorkoutStart = async (e, index) => {
    if (userLevel !== 1 && userLevel !== 4 && daysSinceRegistration >= 2) {
      Alert.alert(
        'Upgrade',
        'You need to upgrade your plan to access this workout',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Upgrade',
            onPress: () => handleUpgrade(),
          },
        ],
        { cancelable: false }
      );
    } else {
      const data = await AsyncStorage.getItem('NumberofWorkOutDone');
      if (data !== null) {
        const parsedData = JSON.parse(data);
        const { count, id } = parsedData;

        AsyncStorage.setItem(
          `NumberofWorkOutDone`,
          JSON.stringify({
            isDone: false,
            date: today,
            count: count,
            id: e._id,
          })
        ).then((res) => {
          navigation.navigate('Start', {
            id: e._id,
            category: e.workout,
            date: today_date,
          });
        });
      } else {
        AsyncStorage.setItem(
          `NumberofWorkOutDone`,
          JSON.stringify({ date: today, count: 0, id: e._id, isDone: false })
        ).then((res) => {
          navigation.navigate('Start', {
            id: e._id,
            category: e.workout,
            date: today_date,
          });
        });
      }
      AsyncStorage.getItem('NumberofWorkOutDone').then((res) => {
        const parsedData = JSON.parse(res);
        if (parsedData !== null) {
          AsyncStorage.getItem('ListOfDoneWorkOut').then((res) => {
            const parsedData = JSON.parse(res);
            if (parsedData !== null) {
              AsyncStorage.mergeItem(
                'ListOfDoneWorkOut',
                JSON.stringify([
                  { id: parsedData.id, date: today_date, isDone: false },
                ])
              );
            } else {
              AsyncStorage.setItem(
                'ListOfDoneWorkOut',
                JSON.stringify(parsedData)
              )
                .then((res) => {
                  getData();
                })
                .catch((err) => console.log(err));
            }
          });
        }
        addDoneDateToObject(e._id, today_date);
      });
    }
  };

  const getData = async () => {
    const data = await AsyncStorage.getItem('ListOfDoneWorkOut');
    setDonePlan(JSON.parse(data));
  };

  const addDoneDateToObject = async (id, today_date) => {
    console.log('addDoneDateToObject ', id, today_date);
    try {
      // Retrieve the array from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('monthlyPlan');
      const array = jsonValue != null ? JSON.parse(jsonValue) : [];
      // Find the object with the specific id and add "doneDate" item
      const objectToUpdate = array.find((item) => item._id === id);
      objectToUpdate.doneDate = today_date;
      objectToUpdate.isDone = false;

      // Stringify the modified array
      const updatedArray = JSON.stringify(array);

      // Save the modified array back to AsyncStorage
      await AsyncStorage.setItem('monthlyPlan', updatedArray);
    } catch (e) {
      console.error(e);
    }
  };
  const addDoneDateToSubObject = async (id, today, sub) => {
    try {
      // Retrieve the array from AsyncStorage
      const jsonValue = await AsyncStorage.getItem('monthlyPlan');
      const array = jsonValue != null ? JSON.parse(jsonValue) : [];
      // Find the object with the specific id and add "doneDate" item
      const objectToUpdate = array[0].sub.find((item) => item._id === id);
      objectToUpdate.doneDate = today;

      // Stringify the modified array
      const updatedArray = JSON.stringify(array);
      // Save the modified array back to AsyncStorage
      await AsyncStorage.setItem('monthlyPlan', updatedArray).then((res) => {
        navigation.navigate('Start', {
          id: id,
          category: sub.workout,
          date: today_date,
        });
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpgrade = async () => {
    Alert.alert(
      'Upgrade',
      'Do you want to upgrade your account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            _handlePressButtonAsync() +
            setUserAuth(null) +
            AuthStorage.removeToken(),
        },
      ],
      { cancelable: false }
    );
  };

  const [result, setResult] = useState(null);
  const _handlePressButtonAsync = async () => {
    if (userLocation !== 'Iran') {
      let result = await WebBrowser.openBrowserAsync(
        `https://www.fitlinez.com/app-pricing?email=${userAuth.email}`
      );
    } else {
      let result = await WebBrowser.openBrowserAsync(
        `https://fitlinez.com/rial-pricing?email=${userAuth.email}`
      );
    }
    setResult(result);
  };

  const filteredItems = _.sortBy(monthlyPlan, ['date'])
    .filter((item) => {
      const itemDate = moment(item.date);
      return itemDate.isBetween(yesterday, nextWeek, null, '[]');
    })
    .slice(0, 6);
  return (
    <SafeAreaView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please give us 5 star!</Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Icon name="star" size={30} color="#FFD700" />
              <Icon name="star" size={30} color="#FFD700" />
              <Icon name="star" size={30} color="#FFD700" />
              <Icon name="star" size={30} color="#FFD700" />
              <Icon name="star" size={30} color="#FFD700" />
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: 20,
              }}>
              <Button
                title="Rate"
                onPress={() => {
                  review();
                  setModalVisible(!modalVisible);
                }}
              />
              <Button
                title="Later"
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView>
        {monthlyPlan ? (
          <View
            style={{
              flex: 1,
              top: 60,

              marginBottom: 100,
            }}>
            <Text
              style={{
                fontSize: 30,
                fontWeight: 'bold',
                textAlign: 'center',
                //fontFamily: 'custom-font',
                color: '#fff',
              }}>
              {monthName} {i18n.t('title')}
            </Text>

            {filteredItems.map((item, index) => {
              //console.log('item', item);
              return (
                <View key={index}>
                  <Card
                    key={index}
                    containerStyle={{
                      backgroundColor: '#fff',
                      borderRadius: 10,

                      borderWidth: 0,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}></View>
                    <TouchableOpacity
                      onPress={() => {
                        setWorkoutStart(item, index);
                      }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          height: 50,
                        }}
                        key={index}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                          }}>
                          {/* {item.doneDate ? (
                            <Icon
                              name="verified"
                              color="#5FBA7C"
                              type="material"
                              size={30}
                              fontWeight="bold"
                            />
                          ) : (
                            <Icon
                              name="alert-circle-outline"
                              color="orange"
                              type="ionicon"
                              size={30}
                            />
                          )} */}
                          {item.workout !== 'Neat' ? item.workout : 'Walking'}
                        </Text>

                        <Icon
                          name={
                            item.workout === 'Rest'
                              ? 'home'
                              : item.workout === 'Cardio'
                              ? 'bicycle'
                              : item.workout === 'Neat'
                              ? 'walk'
                              : 'barbell-outline'
                          }
                          type="ionicon"
                        />
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                        }}>
                        <Image
                          style={{
                            width: '100%',
                            height: 150,
                          }}
                          source={
                            item.workout === 'cardio'
                              ? require('../assets/Cardio.jpeg')
                              : item.workout === 'Neat'
                              ? require('../assets/Neat.jpeg')
                              : item.workout === 'Rest'
                              ? require('../assets/Rest.jpeg')
                              : item.workout === 'Lower body'
                              ? require('../assets/Lower.png')
                              : item.workout === 'Upper body'
                              ? require('../assets/Upper.png')
                              : item.workout === 'Full body'
                              ? require('../assets/Full.png')
                              : item.workout === 'Core'
                              ? require('../assets/Core.png')
                              : null
                          }
                        />
                        <View style={styles.badge}>
                          <Text>
                            {item.date?.substr(0, 10) ===
                            yesterdayDate.toISOString().substr(0, 10) ? (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: 'orange',
                                }}>
                                {i18n.t('yesterday')}
                              </Text>
                            ) : item.date?.substr(0, 10) ===
                              todayDate.toISOString().substr(0, 10) ? (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: 'dodgerblue',
                                }}>
                                {i18n.t('today')}
                              </Text>
                            ) : item.date?.substr(0, 10) ===
                              tommorowDate.toISOString().substr(0, 10) ? (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: '#fff',
                                }}>
                                {i18n.t('tomorrow')}
                              </Text>
                            ) : (
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: '#fff',
                                }}>
                                {item.date?.substr(0, 10)}
                              </Text>
                            )}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    {/* <Card.Divider style={{ height: 10 }} /> */}
                    {item.sub ? (
                      <Text
                        style={{
                          fontSize: 10,
                          fontWeight: 'bold',
                          paddingBottom: 10,
                        }}>
                        Other Activities
                      </Text>
                    ) : null}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}>
                      {item?.sub?.map((sub, index) => {
                        return (
                          <View key={index}>
                            <TouchableOpacity
                              style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                height: 50,
                                textAlign: 'center',
                                alignItems: 'center',
                              }}
                              onPress={() => {
                                addDoneDateToSubObject(sub._id, today, sub);
                              }}>
                              <Text
                                style={{
                                  fontSize: 20,
                                  fontWeight: 'bold',
                                }}>
                                {sub.doneDate ? (
                                  <Icon
                                    name="checkmark-done-outline"
                                    color="#5FBA7C"
                                    type="ionicon"
                                    size={20}
                                  />
                                ) : (
                                  <Icon
                                    iconStyle={{
                                      color: 'orange',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      alignSelf: 'center',
                                      textAlign: 'center',
                                    }}
                                    name="alert-circle-outline"
                                    color="orange"
                                    type="ionicon"
                                    size={20}
                                  />
                                )}
                                {sub?.name}
                              </Text>

                              <Icon name={sub?.icon} type="ionicon" />
                            </TouchableOpacity>
                            <Card.Divider />
                          </View>
                        );
                      })}
                    </View>
                  </Card>
                </View>
              );
            })}
            {/* {userLevel === 0 ? (
              <Button
                title={`upgrade your Plan`}
                buttonStyle={{
                  backgroundColor: '#5FBA7C',
                  borderRadius: 10,
                  width: 200,
                  alignSelf: 'center',
                  marginTop: 20,
                }}
                onPress={handleUpgrade}
              />
            ) : null} */}
          </View>
        ) : (
          //null
          <View
            style={{
              flex: 1,
              marginTop: 100,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
              please wait while we load your plan
            </Text>
            <Text style={{ fontSize: 10, color: '#fff' }}>
              If it takes too long, please check your internet connection
            </Text>

            <Text style={{ fontSize: 10, color: '#fff' }}>
              If problem persists, please contact support
            </Text>
            <Button
              title={`Contact support`}
              buttonStyle={{
                backgroundColor: '#5FBA7C',
                borderRadius: 10,
                width: 200,
                alignSelf: 'center',
                marginTop: 20,
              }}
              onPress={() => navigation.navigate('Support')}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeeklyCal;
const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: 'white',
    backgroundColor: 'rgba(52, 52, 34, 0.8)',
    // paddingHorizontal: 10,
    //paddingVertical: 5,
    borderRadius: 10,
    zIndex: 1, // this makes sure the ribbon is above the imag
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
