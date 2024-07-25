import React, { useContext, useEffect, useState } from 'react';
import ExcerciseTest from './exercise';
import BodyWeightSquat from '../../../../assets/videos/BodyweightSquat.mp4';
import Dip from '../../../../assets/videos/Dip.mp4';
import PushUp from '../../../../assets/videos/PushUp.mp4';
import Circle from '../../../../assets/videos/CirclesElbowShoulders.mp4';
import Cat from '../../../../assets/videos/CatStretch.mp4';
import { Dimensions, View } from 'react-native';
import { Icon, Text, useTheme } from '@rneui/themed';
import { TouchableOpacity, StyleSheet } from 'react-native';
import AppDisclaimer from '../../../../screens/AppDisclaimer';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../../../api/context';
import evaluateUserAbility from '../../../../api/oneRmEva';
import api from '../../../../api/api';

function TestExercise({ route }) {
  //get params
  const { assessmentId, userScore, gender, weight } = route.params;
  const [currentScreen, setCurrentScreen] = useState(0);
  const [userLevelData, setUserLevelData] = useState([]);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { theme } = useTheme();
  const navigation = useNavigation();
  const styles = getStyles(theme);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [message, setMessage] = useState('');
  const handleNext = () => {
    if (currentScreen < 7) {
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

  const handleSubmit = async () => {
    if (assessmentId) {
      try {
        const evaluation = await evaluateUserAbility(
          userLevelData,
          gender,
          weight
        );

        // db.transaction((tx) => {
        //   tx.executeSql('INSERT INTO userAbilities (data) VALUES (?);', [
        //     evaluation,
        //   ]);
        // });

        api
          .put(`/userdata/firstassessment/${assessmentId}`, evaluation)
          .then((res) => {
            setIsLoading(false);
            setShowResult(true);
            setIsSubmitted(true);
            setMessage(res.data.message);
            navigation.navigate('Evaluate');
            // navigation.navigate('Home');
          });
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setShowResult(true);
        setIsSubmitted(false);
        setMessage(err.message);
        console.log(err);
      }
    } else {
      alert('No assessment ID found');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 0,
          left: 20,
          zIndex: 100,
          height: 50,
        }}
        onPress={handleExit}>
        <Icon name="close" color={theme.colors.secondary} size={30} />
      </TouchableOpacity>
      {currentScreen === 0 && (
        <View
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 20,
            height: Dimensions.get('window').height * 0.8,
          }}>
          <Text style={styles.heading}>Exercise and Fitness Disclaimer</Text>
          <AppDisclaimer />
          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>I agree to the terms</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentScreen === 1 && (
        <View
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 20,
          }}>
          <Text style={styles.heading}>It just takes 5 minutes</Text>

          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>Ready?</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentScreen === 2 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            height: '100%',
          }}>
          <ExcerciseTest
            isBodyWeight={true}
            userLevelData={userLevelData}
            setUserLevelData={setUserLevelData}
            videoSource={Circle}
            name={'Circle Elbow'}
            description={'Circles Around Elbow and Shoulders'}
            instructions={[
              'Start to slowly make circles with your arms, keeping them straight and maintaining the shoulder height.',
              'The direction of the circles can be forward or backward, and the size of the circles can vary from small to large. ',
              'Continue this movement for about 30 seconds to a minute, depending on your comfort level.',
              'Rest and repeat the exercise for the desired number of sets, ensuring to alternate the direction of the circles with each set.',
            ]}
          />
          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentScreen === 3 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            height: '100%',
          }}>
          <ExcerciseTest
            userLevelData={userLevelData}
            setUserLevelData={setUserLevelData}
            isBodyWeight={true}
            name={'Cat Stretch'}
            videoSource={Cat}
            description={'Cat Stretch'}
            instructions={[
              'Keep your back flat and your eyes looking down to maintain a neutral spine.              ',
              'As you inhale, slowly arch your back, pushing your belly down towards the floor and lifting your head to look forward.',
              'On the exhale, round your spine upwards towards the ceiling, tucking your tailbone under and bringing your chin towards your chest, like a cat stretching its back.',
            ]}
          />
          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentScreen === 4 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            height: '100%',
          }}>
          <ExcerciseTest
            userLevelData={userLevelData}
            setUserLevelData={setUserLevelData}
            isBodyWeight={true}
            name={'Push Up'}
            videoSource={PushUp}
            description={'Push up'}
            instructions={[
              'Lower your body until your chest is close to the floor, keeping your back straight and your elbows close to your body',
              'Push your body up, extending your arms fully but without locking your elbows, while maintaining your body in a straight line.',
              'Pause for a moment at the top of the push-up.',
              'Lower your body back down to the starting position, ensuring you dont drop your body too quickly, and repeat the exercise. ',
            ]}
          />
          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentScreen === 5 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            height: '100%',
          }}>
          <ExcerciseTest
            userLevelData={userLevelData}
            setUserLevelData={setUserLevelData}
            isBodyWeight={true}
            name={'Dip'}
            videoSource={Dip}
            description={'Dip on Floor with Chair '}
            instructions={[
              'Bend your knees to sit down and place your hands on the edge of the chair, fingers pointing towards your body.              ',
              'Push off your hands and slide your bottom off the chair, lowering your body towards the floor by bending your elbows until they are at about a 90-degree angle.              ',
              'Push your body back up using your arms until they are fully extended, ensuring your hips are close to the chair and your chest is lifted.              ',
              'Repeat this process for your desired number of repetitions, ensuring to maintain proper form throughout the exercise.              ',
            ]}
          />
          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {currentScreen === 6 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            height: '100%',
          }}>
          <ExcerciseTest
            userLevelData={userLevelData}
            setUserLevelData={setUserLevelData}
            isBodyWeight={true}
            name={'Body Weight Squat'}
            videoSource={BodyWeightSquat}
            description={'Body Weight Squat'}
            instructions={[
              'Slowly bend your knees and lower your body as if youre about to sit on a chair, keeping your chest upright and your knees over your toes  ',
              'Continue lowering yourself until your thighs are parallel or almost parallel to the floor, this is the squat position.              ',
              'Pause for a moment in the squat position, then push through your heels to rise back up to the starting position.              ',
            ]}
          />
          <TouchableOpacity onPress={() => handleNext()} style={styles.button}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {currentScreen === 7 && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.primary,
            height: '100%',
          }}>
          {!isSubmitted && (
            <TouchableOpacity
              onPress={() => handleSubmit()}
              style={styles.button}>
              <Text style={styles.buttonText}>
                Submit your Data and see the result
              </Text>
            </TouchableOpacity>
          )}
          {/* {isLoading && (
            <AnimatedLottieView
              source={require('../../../../assets/loading2.json')}
              //autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          )} */}
        </View>
      )}

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, currentScreen === 1 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 2 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 3 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 4 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 5 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 6 && styles.activeDot]} />
        <View style={[styles.dot, currentScreen === 7 && styles.activeDot]} />
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      top: Dimensions.get('window').height * 0.05,

      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    screen: {
      flex: 1,
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
      color: theme.colors.secondary,
      fontSize: 16,
      marginTop: 20,
      marginBottom: 20,
      // textAlign: 'center',
      justifyContent: 'flex-start',
    },
    button: {
      width: '100%',
      borderRadius: 15,
      backgroundColor: theme.colors.secondary,
      // position: 'absolute',
      zIndex: 0,
      bottom: 0,
      paddingVertical: 10,
      paddingHorizontal: 20,
      // borderRadius: 25,
      marginBottom: 10,
    },

    disabledButton: {
      width: '100%',
      borderBottomEndRadius: 20,
      borderBottomStartRadius: 20,
      backgroundColor: theme.colors.grey,
      //position: 'absolute',
      bottom: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      // borderRadius: 25,
      marginBottom: 10,
    },
    buttonText: {
      color: theme.colors.primary,
      fontSize: 16,
      textAlign: 'center',
    },
    disabledButtonText: {
      color: theme.colors.seonndary,
      fontSize: 16,
    },
    dotsContainer: {
      position: 'absolute',
      bottom: Dimensions.get('window').height * 0.05,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#CCC',
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: '#007BFF',
    },
  });

export default TestExercise;
