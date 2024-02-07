import { Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View, StyleSheet } from 'react-native';
import { NumPicker } from '../../picker';
import { Text, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import BodyWeightSquat from '../../../../assets/videos/BodyweightSquat.mp4';
import Dip from '../../../../assets/videos/Dip.mp4';
import PushUp from '../../../../assets/videos/PushUp.mp4';
function ExcerciseTest({
  isBodyWeight,
  videoSource,
  description,
  instructions,
  setUserLevelData,
  name,
  userLevelData,
}) {
  const { theme } = useTheme();
  const styles = getStyles(theme); // Call the function inside the component

  const [levelAssested, setLevelAssested] = useState('');
  const [reps, setReps] = useState(0);
  const [weightPlate, setWeightPlate] = useState(0);
  const navigation = useNavigation();
  const handleUserLevel = () => {
    setUserLevelData((prevData) => {
      // Check if the exercise already exists in the array
      const existingExerciseIndex = prevData.findIndex(
        (exercise) => exercise.exercise === name
      );

      // If the exercise exists, update its values
      if (existingExerciseIndex !== -1) {
        const updatedData = [...prevData];
        updatedData[existingExerciseIndex] = {
          exercise: name,
          reps: reps,
          weightPlate: weightPlate,
        };
        return updatedData;
      }

      // If the exercise doesn't exist, add a new object
      return [
        ...prevData,
        {
          exercise: name,
          reps: reps,
          weightPlate: weightPlate,
        },
      ];
    });
  };

  useEffect(() => {
    handleUserLevel();
  }, [reps, weightPlate]);

  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            //position: 'absolute',
            marginBottom: 10,
            alignSelf: 'center',
            textAlign: 'center',
            width: '100%',
            color: theme.colors.secondary,
            marginTop: 10,
          }}>
          {description}
        </Text>
        <Text
          style={{
            fontSize: 20,
            // fontWeight: 'bold',
            // position: 'absolute',
            marginBottom: 10,
            alignSelf: 'center',
            textAlign: 'center',
            width: '100%',
            color: theme.colors.secondary,
            // marginTop: 10,
          }}>
          Then submit the number of reps you did
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Video
          source={videoSource}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping
          style={{
            width: Dimensions.get('window').width - 40,
            height: Dimensions.get('window').height / 3,
            borderRadius: 20,
          }}
        />
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            marginTop: 10,
            //backgroundColor: theme.colors.grey,

            borderRadius: 20,
            borderTopEndRadius: 0,
            borderBottomEndRadius: 0,
            width: Dimensions.get('window').width - 340,
            height: Dimensions.get('window').height / 3,
          }}>
          {!isBodyWeight && (
            <NumPicker
              label="Insert reps"
              style={{
                opacity: 0.5,
                zIndex: 1,
              }}
              selectedValue={weightPlate}
              setSelectedValue={setWeightPlate}
              data={[...Array(100).keys()]}
            />
          )}
          <NumPicker
            label="Insert reps here"
            selectedValue={reps}
            setSelectedValue={setReps}
            data={[...Array(60).keys()]}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          // backgroundColor: theme.colors.grey,
          opacity: 0.5,
          //borderRadius: 20,
          borderTopEndRadius: 0,
          borderBottomEndRadius: 0,
          width: Dimensions.get('window').width - 340,

          //   height: Dimensions.get('window').height / 20,
        }}></View>
      <View
        style={{
          margin: 20,
        }}>
        {instructions &&
          instructions.map((instruction, index) => (
            <Text
              key={index}
              style={{
                fontSize: 10,
                marginTop: 10,
                color: theme.colors.secondary,
              }}>
              {instruction}
            </Text>
          ))}
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      // flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    screen: {
      // flex: 1,
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
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      width: '100%',
      borderBottomEndRadius: 20,
      borderBottomStartRadius: 20,
      backgroundColor: theme.colors.secondary,
      //position: 'absolute',
      zIndex: 0,
      bottom: 20,
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

export default ExcerciseTest;
