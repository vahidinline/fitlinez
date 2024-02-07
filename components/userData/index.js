import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckBox, useTheme } from '@rneui/themed';
import { ButtonGroup, Icon, Input } from '@rneui/base';
import { DataPicker, NumPicker } from './picker';
import axios from 'axios';
import AnimatedLottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../api/context';
import TestExercise from './testComponent/exercises/';
import * as SQLite from 'expo-sqlite';
import UserImagePicker from './userImage';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
// const db = SQLite.openDatabase('userWeight.db'); // Open or create the database
const userDb = SQLite.openDatabase('user.db'); // Open or create the database

const GetUserData = () => {
  useEffect(() => {
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     'CREATE TABLE IF NOT EXISTS userWeight (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, weight NUMBER);'
    //   );
    // });
    userDb.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS userData (id INTEGER PRIMARY KEY NOT NULL, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, name TEXT, age NUMBER, height NUMBER, gender TEXT, targetWeight NUMBER,  weight NUMBER, unit TEXT,mainGoal TEXT,preferedLocation TEXT,level TEXT,dayPrefered TEXT);'
      );
    });
  }, []);

  const saveUserWeight = (data) => {
    userDb.transaction(
      (tx) => {
        tx.executeSql(
          'INSERT INTO user (name, age, height, gender, targetWeight, level, goal, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
          [
            data.name,
            data.age,
            data.height,
            data.gender,
            data.targetWeight,
            data.level,
            data.goal,

            data.weight,
          ],
          () => {
            console.log('Data successfully inserted into userDB');
          },
          (error) => {
            console.log('Error inserting data into userDB', error);
          }
        );
      },
      (error) => {
        console.log('Transaction error:', error);
      }
    );
  };
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState(1);
  const styles = getStyles(theme); // Call the function inside the component
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedValue, setSelectedValue] = useState('');
  const [age, setAge] = useState(null);
  console.log('age', age);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState(null);
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('Select');
  const [level, setLevel] = useState('Select');
  const [targetWeight, setTargetWeight] = useState(0);
  const [showtest, setShowtest] = useState(false);
  const navigation = useNavigation();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { userAuth } = useContext(AuthContext);
  const [name, setName] = useState(userAuth.name ? userAuth.name : null);
  const [avatar, setAvatar] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const userId = userAuth.id;
  const handleNext = () => {
    if (currentScreen < 5) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      userDb.transaction(async (tx) => {
        await tx.executeSql('SELECT * FROM user', [], (_, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            const row = results.rows.item(i);
            //add value to state
            setName(row.name);
            setAge(row.age);
            setWeight(row.weight);
            setGender(row.gender);
            setSelectedIndex(gender === 'female' ? 0 : 1);
            setHeight(row.height);
            setGoal(row.goal);
            setLevel(row.level);
            setTargetWeight(row.targetWeight);
          }
        });
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (gender === '') {
      if (selectedIndex === 0) {
        setGender('female');
      } else {
        setGender('male');
      }
    }
  }, [selectedIndex]);
  const handleLast = () => {
    assessLiftingAbility(age, gender, weight, height, goal, level);
    if (currentScreen < 5) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScreen > 1) {
      setCurrentScreen(currentScreen - 1);
    }
  };

  const handleExit = () => {
    navigation.navigate('Home');
  };

  function assessLiftingAbility(age, gender, weight, height, goal, level) {
    let score = 0;

    // Age Factor
    if (age < 20) score += 2;
    else if (age < 30) score += 1.8;
    else if (age < 40) score += 1.6;
    else if (age < 50) score += 1.2;
    else score += 0.8;
    // Gender Factor
    score += gender === 'male' ? 2 : 1.5;

    // BMI Factor
    const bmi = weight / (height / 100) ** 2;
    if (bmi < 18.5) score += 1;
    else if (bmi < 24.9) score += 1.5;
    else if (bmi < 29.9) score += 1.2;
    else score += 0.8;
    // Goal Factor
    const goalFactors = {
      'Lose fat': 1,
      'Gain weight': 1.2,
      'Maintain weight': 1.1,
      'Build Muscle': 1.5,
    };
    score += goalFactors[goal];
    // Activity Level Factor
    const activityFactors = {
      Rookie: 0.5,
      Beginner: 1,
      Intermediate: 1.5,
      Advanced: 2,
    };
    score += activityFactors[level];
    // Normalize the score to a scale of 0 to 10
    score = Math.min(Math.max(score, 0), 10);
    setUserScore(score);
    return score;
  }

  const handlegoToResult = () => {
    const data = {
      userId: userId,
      name: name,
      age: age,
      weight: weight,
      height: height,
      goal: goal,
      gender: gender,
      level: level,
      avatar: avatar,
    };
    saveUserWeight(data);

    navigation.navigate('Evaluate', {
      userScore: userScore,
    });
  };

  const submitUserData = () => {
    const data = {
      userId: userId,
      name: name,
      age: age,
      weight: weight,
      height: height,
      goal: goal,
      gender: gender,
      level: level,
    };

    try {
      saveUserWeight(data);
      axios
        .post('https://jobitta.com/userdata/firstassessment', data)
        .then((res) => {
          navigation.navigate('TestExercise', {
            assessmentId: res.data._id,
            userScore: userScore,
            gender,
            weight,
          });
          // handleNext();
        });
    } catch (err) {
      console.log(err);
      handleExit();
    }
  };

  useEffect(() => {
    //AsyncStorage.removeItem('@acceptTerms');
    const checkPreviousAcceptance = async () => {
      const value = await AsyncStorage.getItem('@acceptTerms');
      if (value === 'true') {
        setAcceptTerms(true);
      }
    };

    checkPreviousAcceptance();
  }, []);

  const handleCheckTerms = async () => {
    if (!acceptTerms) {
      await AsyncStorage.setItem('@acceptTerms', 'true');
      setAcceptTerms(true);
    } else {
      await AsyncStorage.removeItem('@acceptTerms');
      setAcceptTerms(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          zIndex: 100,
        }}
        onPress={handleExit}>
        <Icon name="close" color={theme.colors.secondary} size={30} />
      </TouchableOpacity>

      {currentScreen === 1 && (
        <View style={styles.screen}>
          <UserImagePicker setAvatar={setAvatar} />
          {/* <AnimatedLottieView
            source={require('../../assets/assess.json')}
            autoPlay
            loop
            style={{
              width: Dimensions.get('window').width / 3,
              height: Dimensions.get('window').width / 3,
            }}
          /> */}
          <ButtonGroup
            buttonContainerStyle={{
              // borderRadius: 20,
              //backgroundColor: theme.colors.primary,
              borderColor: theme.colors.secondary,
            }}
            selectedButtonStyle={{
              backgroundColor: theme.colors.secondary,
            }}
            buttonStyle={{
              //  backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
              borderRadius: 20,
            }}
            buttons={[`${i18n.t('female')}`, `${i18n.t('male')}`]}
            selectedIndex={selectedIndex}
            onPress={(value) => {
              setSelectedIndex(value);
            }}
            innerBorderStyle={{
              //color: theme.colors.primary,
              width: 0.0,
            }}
            containerStyle={{
              marginBottom: 20,
              borderRadius: 20,
              backgroundColor: theme.colors.grey0,
              borderColor: theme.colors.primary,
            }}
            textStyle={{
              color: theme.colors.primary,
            }}
            selectedTextStyle={{
              color: theme.colors.primary,
            }}
          />
          {name && <Text style={styles.heading}>Hi {name},</Text>}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 30,
              flex: 0.5,
            }}>
            <NumPicker
              label={i18n.t('age')}
              selectedValue={age}
              defaultValue={age}
              setSelectedValue={setAge}
              data={[...Array(100).keys()].map((num) => num + 15)}
              style={{
                marginBottom: 20,
              }}
            />
            <NumPicker
              label={i18n.t('weight')}
              defaultValue={weight}
              selectedValue={weight}
              setSelectedValue={setWeight}
              data={[...Array(300).keys()].map((num) => num + 30)}
              style={{
                marginBottom: 20,
              }}
            />
            {/* <NumPicker
              label="Target weight(kg)"
              selectedValue={targetWeight}
              setSelectedValue={setTargetWeight}
              data={[...Array(240).keys()].map((num) => num + 130)}
              style={{
                marginBottom: 20,
              }}
            /> */}
            <NumPicker
              label={i18n.t('height')}
              selectedValue={height}
              //defaultValue={height}
              setSelectedValue={setHeight}
              data={[...Array(240).keys()].map((num) => num + 130)}
              style={{
                marginBottom: 20,
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              bottom: 60,
              marginBottom: 0,
              backgroundColor: theme.colors.primary,
            }}>
            {!acceptTerms ? (
              <CheckBox
                titleProps={{
                  style: {
                    color: theme.colors.secondary,
                  },
                }}
                textStyle={{
                  color: theme.colors.primary,
                }}
                title={
                  <>
                    <Text> I accept the </Text>
                    <Text
                      style={{ textDecorationLine: 'underline' }}
                      onPress={() =>
                        Linking.openURL(
                          'https://www.fitlinez.com/terms-of-service'
                        )
                      }>
                      terms and conditions
                    </Text>
                    <Text> and </Text>
                    <Text
                      style={{ textDecorationLine: 'underline' }}
                      onPress={() =>
                        Linking.openURL(
                          'https://www.fitlinez.com/privacy-policy'
                        )
                      }>
                      privacy policy
                    </Text>
                  </>
                }
                checked={acceptTerms}
                onPress={handleCheckTerms}
                style={{
                  marginBottom: 20,
                  color: theme.colors.secondary,
                }}
              />
            ) : (
              <Text
                style={{
                  color: theme.colors.secondary,
                  textAlign: 'center',
                  marginBottom: 20,
                  width: '100%',
                }}>
                Thank you for accepting the terms and conditions
              </Text>
            )}
          </View>
          <TouchableOpacity
            disabled={
              age === null ||
              weight === null ||
              height === null ||
              gender === null ||
              !acceptTerms
            }
            style={
              age === null ||
              weight === null ||
              height === null ||
              gender === null ||
              !acceptTerms
                ? styles.disabledButton
                : styles.button
            }
            onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 2 && (
        <View style={styles.screen}>
          <Text style={styles.heading}> What’s your goal?</Text>
          <DataPicker
            label="Goal"
            selectedValue={goal}
            setSelectedValue={setGoal}
            data={[
              'Select',
              'Lose fat',
              'Gain weight',
              'Build Muscle',
              'Maintain weight',
            ]}
          />
          <Text style={styles.heading}>
            Your regular physical activity level?
          </Text>
          <DataPicker
            label="Level"
            selectedValue={level}
            setSelectedValue={setLevel}
            data={['select', 'Rookie', 'Beginner', 'Intermediate', 'Advanced']}
          />
          <TouchableOpacity
            disabled={goal === 'Select' || level === 'Select'}
            style={
              goal === 'Select' || level === 'Select'
                ? styles.disabledButton
                : styles.button
            }
            onPress={handleLast}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={handlePrevious}>
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity> */}
        </View>
      )}

      {currentScreen === 3 && (
        <View style={styles.screen}>
          <Text style={styles.heading}>Let's evaluate your strengths</Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginBottom: 0,
              //backgroundColor: theme.colors.secondary,
              position: 'absolute',
              bottom: 60,
              width: '100%',
            }}>
            <TouchableOpacity
              style={{
                ...styles.button,
                // backgroundColor: theme.colors.secondary,
              }}
              onPress={() => submitUserData()}>
              <Text style={styles.buttonText}>Evaluate</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlegoToResult}>
              <Text
                style={{
                  ...styles.buttonText,
                  color: theme.colors.secondary,
                  textAlign: 'center',
                  fontSize: 10,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>

          {/* 
          <TouchableOpacity style={styles.button} onPress={handleExit}>
            <Text style={styles.buttonText}>Start Now </Text>
          </TouchableOpacity> */}
        </View>
      )}
      {currentScreen === 4 && (
        <View style={styles.screen}>
          {!showtest && (
            <View>
              <TestExercise
                userScore={userScore}
                level={selectedValue}
                goal={selectedValue}
                selectedValue={selectedValue}
                setSelectedValue={setSelectedValue}
                isBodyWeight={true}
              />
            </View>
          )}

          {/* <TouchableOpacity style={styles.button} onPress={handleExit}>
            <Text style={styles.buttonText}>Start Now </Text>
          </TouchableOpacity> */}
        </View>
      )}

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, currentScreen === 1 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 2 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 3 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 4 && styles.activeDot]} />
      </View>
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f2f4f5',
    },
    screen: {
      flex: 1,
      height: Dimensions.get('window').height / 1.5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.secondary,
      textAlign: 'center',
    },
    description: {
      color: '#f2f4f5',
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: 'white',
      position: 'absolute',
      bottom: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },

    disabledButton: {
      backgroundColor: 'grey',
      position: 'absolute',
      bottom: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginBottom: 10,
    },
    buttonText: {
      color: 'black',
      fontSize: 16,
    },
    disabledButtonText: {
      color: 'white',
      fontSize: 16,
    },
    dotsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: 'grey',
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: '#007BFF',
    },
  });

export default GetUserData;
