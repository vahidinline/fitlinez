import React, { useContext, useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import TimeContext from '../api/TimeSpentContext';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { Icon, Switch } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../api/langcontext';
import i18nt from '../locales';
import { Button } from '@rneui/themed';

const Start = (props) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { id, date, category } = props.route.params;
  console.log(props.route.params.workouts);
  const [confirmEating, setConfirmEating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [locSelector, setLocSelector] = useState('Gym');
  useEffect(() => {
    setLocSelector(isEnabled ? 'Home' : 'Gym');
  }, [isEnabled]);
  let newDate = new Date();
  const timeContext = useContext(TimeContext);

  const dosomeThing = () => {
    navigation.navigate('DailyPlan', {
      category: props.route.params.category,
      //workouts: props.route.params.workouts,
      currentWorkout: id,
      dateDone: date,
      locSelector: locSelector,
    });
    timeContext.setWorkoutDuration(newDate);
  };

  const navigation = useNavigation();
  // const createSaveDoneWorkOut = async (value) => {
  //   try {
  //     await AsyncStorage.setItem(
  //       'saveDoneWorkOut',
  //       JSON.stringify([{ category, date }])
  //     );
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // const updateSaveDoneWorkOut = async (value) => {
  //   try {
  //     const data = await AsyncStorage.getItem('saveDoneWorkOut');
  //     const dataParse = JSON.parse(data);
  //     const newData = [...dataParse, { category, date }];
  //     await AsyncStorage.setItem('saveDoneWorkOut', JSON.stringify(newData));
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   const saveDoneWorkOut = async () => {
  //     const data = await AsyncStorage.getItem('saveDoneWorkOut');
  //     console.log(JSON.parse(data));
  //     if (data === null) {
  //       console.log('saveDoneWorkOut === null');
  //       createSaveDoneWorkOut();
  //     } else {
  //       console.log('saveDoneWorkOut !== null');
  //       updateSaveDoneWorkOut();
  //     }
  //   };
  //   saveDoneWorkOut();
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      {!confirmEating ? (
        <TouchableOpacity onPress={() => setConfirmEating(true)}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#3F3B6C',
                fontSize: 15,
              }}>
              {i18n.t('confirmEating')}{' '}
            </Text>
            {/* <Icon
              name="check-circle-outline"
              type="material-community"
              color="#3F3B6C"
              size={20}
              style={{ alignSelf: 'center', marginTop: 20 }}
            /> */}
            <Text
              style={{
                color: '#3F3B6C',
                fontSize: 15,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                marginTop: 20,
                borderColor: '#3F3B6C',
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                backgroundColor: '#3F3B6C',
              }}>
              بله
            </Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => dosomeThing()}>
          <Text
            style={{
              color: '#3F3B6C',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 20,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              //fontFamily: 'custom-font',
            }}>
            {i18n.t('startWorkoutTitle')}
          </Text>
          {/* <LottieView
            autoPlay
            loop={true}
            source={require('../assets/go.json')}
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
            }}></LottieView> */}
        </TouchableOpacity>
      )}

      {category !== 'cardio' ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            margin: 20,
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Icon
              name="domain"
              type="material-community"
              color="white"
              size={30}
              style={{ alignSelf: 'flex-start', marginLeft: 20 }}
            />
            <Text
              style={[
                styles.box,
                {
                  color: locSelector === 'Gym' ? '#3F3B6C' : 'darkgray',
                  marginRight: 10,
                  fontWeight: locSelector === 'Gym' ? 'bold' : 'normal',
                },
              ]}>
              {i18n.t('gymWorkout')}
            </Text>
          </View>

          <Switch
            trackColor={{ false: 'lightgray', true: 'lightgray' }}
            thumbColor={isEnabled ? '3F3B6C' : '#f5dd4b'}
            ios_backgroundColor="lightgray"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Icon
              name="home"
              type="material-community"
              color="white"
              size={30}
              style={{ alignSelf: 'flex-start', marginLeft: 20 }}
            />
            <Text
              style={[
                styles.box,
                {
                  color: isEnabled ? '#3F3B6C' : 'darkgray',
                  marginLeft: 10,
                  fontWeight: locSelector === 'Home' ? 'bold' : 'normal',
                },
              ]}>
              {i18n.t('homeWorkout')}
            </Text>
          </View>
        </View>
      ) : null}
      <View>
        <Button
          mode="contained"
          color="#f5dd4b"
          onPress={() => navigation.goBack()}
          style={{
            width: '80%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          {i18n.t('back')}
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: '#fff',
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
  },
  title: {
    fontSize: 32,
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
  },
  box: { fontSize: 15, color: '#fff' },
});
export default Start;
