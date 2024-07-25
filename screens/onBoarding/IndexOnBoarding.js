import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GenderSelection from './gender';
import AgeSelection from './age';
import HeightSelection from './height';
import WeightSelection from './weight';
import GoalSelection from './mainGoal';
import LocationSelection from './locationSelection';
import BeforeSubmit from './beforeSubmit';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { IconArrowLeft } from '../marketplace/filters/icons-';
import FitnessLevel from './fitnessLevel';
import DayPreferences from './DayPreferences';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LastPageOnboarding from './LastPage';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import api from '../../api/api';
import AuthContext from '../../api/context';
import { StatusBar } from 'expo-status-bar';

function IndexOnBoarding() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [currentStep, setCurrentStep] = useState(0);
  const [beforeSubmit, setBeforeSubmit] = useState(false);
  const navigation = useNavigation();
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [userData, setUserData] = useState([]);
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  //console.log('userData', userData);

  useEffect(() => {
    if (currentStep === steps.length - 2) {
      console.log('last step');
      //handleSubmit();
    }
  }, [currentStep]);

  const handleSubmit = async () => {
    console.log('userData into handleSubmit');
    try {
      const data = userData;
      const mergedObject = data.reduce((acc, curr) => {
        return { ...acc, ...curr };
      }, {});

      // Overwrite the existing key with the new data
      const newData = JSON.stringify(data);
      await submitUserDataToCloud(mergedObject);
      const asycRes = await AsyncStorage.setItem('userBasicData', newData);
      //console.log('asycRes', asycRes);
      //navigation.navigate('LastPageOnboarding');
    } catch (error) {
      console.log('Error in handleSubmit:', error);
    }
  };

  const addToArray = (object) => {
    // Check if object is not null, not undefined, and doesn't contain null values
    if (
      object !== null &&
      object !== undefined &&
      !Object.values(object).includes(null)
    ) {
      setUserData((prevUserData) => {
        // Get the key of the new object
        const key = Object.keys(object)[0];

        // Check if the object already exists in the userData
        const existingObjectIndex = prevUserData.findIndex((item) =>
          item.hasOwnProperty(key)
        );

        // If the object exists, update the value
        if (existingObjectIndex > -1) {
          const updatedUserData = [...prevUserData];
          updatedUserData[existingObjectIndex] = object;
          return updatedUserData;
        }

        // If the object does not exist, add the new object
        return [...prevUserData, object];
      });
      setButtonDisabled(false);
    }
  };

  useEffect(() => {
    // Disable the button each time a new step is mounted, except for the last step
    if (currentStep < steps.length - 2) {
      setButtonDisabled(true);
    }
  }, [currentStep]);

  const handlebutton = () => {
    if (currentStep === steps.length - 2) {
      console.log('last step');
      handleSubmit();
      navigation.navigate('WorkoutListIndex');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home' }],
      // });
    } else {
      console.log('not last step');
      onNext();
    }
  };
  const submitUserDataToCloud = async (mergedObject) => {
    console.log('sending data to cloud');
    //add user id to the data

    try {
      const res = await api.post(
        `/userdata/firstassessment/${userId}`,
        mergedObject
      );
      //console.log('response of storing user basic data', res);
    } catch (error) {
      console.log('error', error);
    } finally {
      AsyncStorage.setItem('userBasicData', JSON.stringify(userData));
    }
  };

  const steps = [
    <GenderSelection onGenderSelect={addToArray} i18n={i18n} />,
    <AgeSelection onAgeSelect={addToArray} i18n={i18n} />,
    <HeightSelection onHeightSelect={addToArray} i18n={i18n} />,
    <WeightSelection onWeightSelect={addToArray} i18n={i18n} />,
    <GoalSelection onGoalSelect={addToArray} i18n={i18n} />,
    <LocationSelection onLocationSelect={addToArray} i18n={i18n} />,
    <FitnessLevel onFitnessLevelSelect={addToArray} i18n={i18n} />,
    <DayPreferences onDayPreferencesSelect={addToArray} i18n={i18n} />,
    // <EquipmentSelection onEquipmentSelect={addToArray} i18n={i18n}/>,
    // <DisabilitiesSelection onDisabilitiesSelect={addToArray} i18n={i18n}/>,
    <BeforeSubmit data={userData} onConfirm={setBeforeSubmit} i18n={i18n} />,
    <LastPageOnboarding />,
  ];
  const onNext = () => {
    // move the step forward
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  console.log('currentStep', currentStep, '/', steps.length);
  const onPrev = () => {
    // move the step back
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <TouchableOpacity
        onPress={() => onPrev()}
        style={{
          // flex: 0.07,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginLeft: 20,
          marginRight: 20,
          marginBottom: 20,
        }}>
        <IconArrowLeft />
      </TouchableOpacity>
      {currentStep < steps.length - 1 && (
        <View
          style={{
            //flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
          }}>
          <View
            style={{
              width: Dimensions.get('window').width * 0.8,
              marginLeft: 20,
              marginRight: 5,
              top: 7,
            }}>
            <ProgressBar
              progress={(currentStep + 1) / (steps.length - 1)}
              color={theme.colors.secondary}
            />
          </View>

          <View
            style={{
              width: '12%',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                bottom: 5,
                marginRight: 5,
                fontFamily: 'Vazirmatn',
                color: theme.colors.secondary,
              }}>{`${currentStep + 1}`}</Text>
            <Text
              style={{
                marginRight: 5,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#787680',
                fontFamily: 'Vazirmatn',
              }}>{`/ ${steps.length}`}</Text>
          </View>
        </View>
      )}
      <View
        style={{
          flex: 1,
          //flexDirection: 'row',
          // justifyContent: 'space-between',
          marginTop: 20,
          marginLeft: 20,
          marginRight: 20,
        }}>
        {/* all steps will be show here one by one */}
        {steps[currentStep]}
      </View>
      <View
        style={{
          flex: 1,
          //flexDirection: 'row',
          // justifyContent: 'space-between',
          position: 'absolute',
          bottom: 10,
          width: Dimensions.get('window').width - 40,
          marginLeft: 20,
          marginRight: 20,
        }}>
        <Button
          disabled={buttonDisabled}
          buttonStyle={{
            marginTop: 20,
            borderRadius: 8,
            backgroundColor: theme.colors.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            bottom: 20,
          }}
          onPress={() => handlebutton()}
          titleStyle={{
            fontFamily: 'Vazirmatn',
            color: theme.colors.primary,
          }}
          title={
            currentStep === steps.length - 2 ? i18n.t('done') : i18n.t('next')
          }
        />
      </View>
    </SafeAreaView>
  );
}

export default IndexOnBoarding;

const getStyles = (theme) =>
  StyleSheet.create({
    AndroidSafeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
  });
