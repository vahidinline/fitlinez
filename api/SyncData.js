import { Button, Text } from '@rneui/themed';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Platform, Alert } from 'react-native';
import AuthContext from './context';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useRef } from 'react';
import AthleticNumber from './numberStyle';
import { I18n } from 'i18n-js';
import { useFonts } from 'expo-font';
import LanguageContext from './langcontext';
import i18nt from '../locales';

const SyncData = (props) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [newRecord, setNewRecord] = useState([]);
  //console.log('props', props);
  // console.log('newRecord', newRecord);
  const [sessionCount, setSessionCount] = useState();
  const navigation = useNavigation();
  const { userAuth } = useContext(AuthContext);
  const [userId, setUserId] = useState(userAuth.id);
  //const [doneWorkOutData, setDoneWorkOutData] = useState(props.route.params.doneWorkOutData);

  const [isLoading, setIsLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(
    props.route.params.doneWorkOutData
  );

  const [doneWorkOutData, setDoneWorkOutData] = useState(
    props.route.params.doneWorkOutData
  );
  //console.log('doneWorkOutData', doneWorkOutData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isData, setIsData] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [state, setState] = useState({});
  const today = new Date().toISOString().substring(0, 10);
  const animationRef = useRef(null);

  const createfilteredData = () => {
    const filteredData = props.route.params.filter((item) => {
      if (item.date === today) {
        return item;
      }
    });
    setDoneWorkOutData(filteredData);
  };
  useEffect(() => {
    createfilteredData();
  }, []);
  const SendData = () => {
    setIsLoading(true);
    AsyncStorage.setItem(`${today}`, JSON.stringify(doneWorkOutData))

      // axios
      //   .post('https://jobitta.com/userworkoutdata', {
      //     doneWorkOutData,
      //     userId,
      //   })
      .then(async (res) => {
        Alert.alert('Success', 'Your data has been saved successfully');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
        setState({});
      })
      .then(() => {
        setIsLoading(false);
        setIsDisabled(true);
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert('Error', 'Something went wrong. Please try again later');
        ///console.log(error);
      });
  };

  useEffect(() => {
    AsyncStorage.getItem('NumberofWorkOutDone').then((data) => {
      const result = JSON.parse(data);
      setSessionCount(JSON.parse(data).count);
      setIsLoaded(true);
    });
  }, []);

  const Success = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',

          flexDirection: 'column',
          borderRadius: 10,
        }}>
        {/* <LottieView
          source={require('../assets/first.json')}
          autoPlay
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
          }}></LottieView> */}

        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
          {sessionCount !== 0 ? (
            <Text style={Styles.text}>
              <AthleticNumber number={sessionCount} />
              session of workout.
            </Text>
          ) : null}
        </View>
        {newRecord !== null && (
          <View
            style={{
              alignItems: 'center',
              //backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <Text
              style={
                ([Styles.text],
                {
                  color: '#3F3B6C',
                  top: 10,
                  fontSize: 15,
                  padding: 10,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                })
              }>
              {i18n.t('medal')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 20,
                flexWrap: 'wrap',
              }}>
              {newRecord.map((item, index) => {
                return (
                  <View key={index}>
                    {/* <LottieView
                      source={require('../assets/medal.json')}
                      autoPlay
                      style={{
                        width: 40,
                        height: 40,
                        alignSelf: 'center',
                      }}></LottieView> */}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        <View>
          <Button
            icon="content-save"
            mode="contained"
            style={{
              backgroundColor: '#3F3B6C',
              borderRadius: 10,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
            }}
            disabled={isDisabled}
            onPress={() => {
              SendData();
            }}
            loading={isLoading}
            // loadingProps={{ color: '#3F3B6C' }}
            title="Save your Records"
            titleStyle={{ color: 'white' }}>
            <Text>{i18n.t('saveWorkout')}</Text>
          </Button>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                color: '#3F3B6C',
                fontSize: 15,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {i18n.t('reminderEating')}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const Unsuccess = () => {
    return (
      <>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#3F3B6C',
          }}>
          You didn't do anything. Please come back and do some workout{' '}
        </Text>
        <View>
          <Button
            icon="arrow-left"
            mode="contained"
            style={{
              backgroundColor: '#3a86ff',
              borderRadius: 10,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
            }}
            onPress={() => {
              navigation.navigate('DailyPlan');
            }}
            title="Back"
            titleStyle={{ color: 'white' }}>
            <Text>{i18n.t('back')}</Text>
          </Button>
        </View>
      </>
    );
  };

  const SyncPromise = () => {
    return new Promise((resolve, reject) => {
      doneWorkOutData.length !== 0 ? resolve() : reject();
    });
  };

  useEffect(() => {
    SyncPromise()
      .then(() => {
        setIsData(true);
      })
      .catch(() => {
        return null;
      });
  }, [doneWorkOutData]);
  // if (isLoaded) {
  //   return <ActivityIndicator />;
  // }
  useEffect(() => {
    // it is supposed to save the All Record data in the single async storage
    const fetchData = async () => {
      AsyncStorage.getItem(today).then((data) => {
        const result = JSON.parse(data);
        setNewRecord(result);
      });
      const newData = newRecord;
      try {
        const existingData = await AsyncStorage.getItem('ListOfRecoreds');
        if (existingData !== null) {
          const mergedData = JSON.stringify([
            ...JSON.parse(existingData),
            ...newData,
          ]);
          await AsyncStorage.setItem('ListOfRecoreds', mergedData);
        } else {
          const newAsyncStorageData = JSON.stringify(newData);
          await AsyncStorage.setItem('ListOfRecoreds', newAsyncStorageData);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <SafeAreaView style={Styles.container}>
        {isData ? <Success /> : <Unsuccess />}
      </SafeAreaView>
    </>
  );
};
const Styles = StyleSheet.create({
  text: {
    color: '#3F3B6C',
    fontSize: 15,
    //  textShadowColor: '#000',
  },
  tableText: {
    color: '#3F3B6C',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    margin: 10,
    borderRadius: 10,
    padding: 10,
    flex: 1,
    top: Platform.OS === 'ios' ? 30 : 40,
  },
  number: {
    color: '#3F3B6C',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    //textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});

export default SyncData;
