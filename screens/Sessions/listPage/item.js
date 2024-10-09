import { Button, Image, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  PixelRatio,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import WeightAndSetsInput from './inputs/input';
import RepsInput from './inputs/repsInput';
import { StyleSheet } from 'react-native';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
import { SessionContext } from '../../../api/sessionContext';
import ImageLoader from './image';
import TimerInput from './inputs/timerInput';
import RestCounterComponent from './inputs/counter';
import Subs from './subs';
import * as Icons from '../../marketplace/filters/icons';
import api from '../../../api/api';
import convertToPersianNumbers from '../../../api/PersianNumber';
import DrawerList from './drawer';
const { width, height } = Dimensions.get('window');

function Item({
  userId,
  doneItem,
  exerciseId,
  title,
  index,
  gifUrl,
  faInstructor,
  inputType,
  setFinish,
  type,
  loc,
  bodyPart,
  category,
  handleSubsitute,
  sortedData,
  allExcerciesIds,
  mainTarget,
  otherTarget,
  target,
  userLocation,
  setSaveTimer,
  dataLength,
  description,
  userLevel,
  setShowList,
}) {
  const { userLanguage } = useContext(LanguageContext);
  const { IconSub } = Icons;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [childDataMap, setChildDataMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [buttonTitle, setButtonTitle] = useState(i18n.t('nextSet'));
  const [visible, setVisible] = useState(false);
  let adjustedNumberOfSets = 4;
  const [showRest, setShowRest] = useState(false);
  const { sessionData, setSessionData } = useContext(SessionContext);

  let buttonVisible = true;
  if (index >= dataLength - 1) {
    buttonVisible = false;
  }

  const RTL = userLanguage === 'fa';
  const handleStoreData = async ({
    weight,
    reps,
    category,
    exerciseId,
    totalWeight,
    title,
    itemIndex,
    setIndex,
    timestamp,
    exerciseType,
    duration,
  }) => {
    try {
      setChildDataMap({
        weight,
        reps,
        category,
        exerciseId,
        totalWeight,
        title,
        itemIndex,
        setIndex,
        timestamp,
        exerciseType,
        duration,
      });
    } catch (error) {
      console.error('Error storing data', error);
    }
  };

  const saveToCloud = async (childDataMap) => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    console.log('title in item', title);
    const response = await api
      .post('/workouthistory', {
        userId,
        location: loc,
        sessionId: sessionId,
        childDataMap,
      })
      .then((response) => {
        console.log('saved to cloud');
      });
  };

  useEffect(() => {
    try {
      AsyncStorage.setItem(
        `${exerciseId}-${childDataMap.setIndex}`,
        JSON.stringify({
          weight: childDataMap.weight,
          reps: childDataMap.reps,
        })
      );
    } catch (e) {
      console.log('error', e);
    }
  }, [childDataMap]);

  const updateTotalWeight = async (weight) => {
    try {
      let oldValue = await AsyncStorage.getItem('@total_weight');

      // Parse the oldValue as a number, and if it's not a valid number, default to 0
      oldValue = parseFloat(oldValue) || 0;

      // Check if the parsed oldValue is NaN
      if (isNaN(oldValue)) {
        console.log('Parsed oldValue is NaN');
        oldValue = 0;
      }

      const totalWeight = oldValue + weight;

      // Check if the totalWeight is NaN
      if (!isNaN(totalWeight)) {
        await AsyncStorage.setItem('@total_weight', totalWeight.toString());
      } else {
        console.log('Error: totalWeight is NaN');
      }
    } catch (error) {
      console.error('Error updating total weight', error);
    }
  };

  useEffect(() => {
    if (saveCount + 1 >= adjustedNumberOfSets) {
      if (index >= dataLength - 1) {
      } else {
        setButtonTitle(i18n.t('nextExercise'));
      }
    } else {
      setButtonTitle(i18n.t('nextSet'));
    }
  }, [currentIndex, saveCount, adjustedNumberOfSets]);

  if (type === 'warmup' || type === 'cooldown') {
    adjustedNumberOfSets = 1;
  }

  const saveExerciseState = async (data) => {
    const jsonValue = JSON.stringify(data);
    try {
      await AsyncStorage.setItem('@current_exercise_state', jsonValue);
    } catch (err) {
      console.error('Error saving data', err);
    }
  };

  const handleButton = async () => {
    setShowList(false);
    saveExerciseState(childDataMap);
    saveToCloud(childDataMap);
    updateTotalWeight(childDataMap.totalWeight); //use new function here
    setSaveTimer(true);
    setShowRest((prevShowRest) => !prevShowRest);
    setSessionData((prevState) => [
      ...prevState,
      { setIndex: prevState.length + 1, exerciseId: exerciseId },
    ]);

    setSaveCount((prevCount) => {
      let count = prevCount + 1;
      if (count >= adjustedNumberOfSets) {
        if (index >= dataLength - 1) {
          // setFinish(true);
        } else {
          doneItem(index);
        }
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
      if (count >= adjustedNumberOfSets && index >= dataLength - 1) {
        // doneItem(index);
        setFinish(true);
      }

      return count;
    });
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: Dimensions.get('window').width / 1.2,
          // height: Dimensions.get('window').height / 40,
          marginHorizontal: 35,
          paddingHorizontal: 10, // Add some padding if needed
        }}>
        <Text
          style={{
            fontSize: PixelRatio.get() > 2 ? 20 : 22,
            textTransform: 'capitalize',
            fontFamily: 'Vazirmatn',
            color: theme.colors.secondary,
            textAlign: 'center', // Center the text
            flexWrap: 'wrap', // Allow text to wrap
            width: '100%', // Make sure it takes the full width of the parent
          }}
          numberOfLines={2} // Set to 2 to limit to two lines if necessary
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          position: 'relative',
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 4,
          backgroundColor: '#fff',

          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          // marginLeft: showList && 75,
          marginHorizontal: 20,
        }}>
        <View
          style={{
            position: 'absolute',
            marginHorizontal: 10,
            marginVertical: 10,
            top: 0,
            right: 0,
            zIndex: 100,
          }}>
          <TouchableOpacity
            //onPress={() => PremiumChecker(userLevel, setVisible)}
            onPress={() => setVisible(true)}
            style={{
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: theme.colors.secondary,
                fontWeight: '600',
                fontSize: 12,
                // top: 2,
                // marginRight: 10,
                fontFamily: 'Vazirmatn',
              }}>
              {i18n.t('SubstituteWorkout')}
            </Text>
            <IconSub />
          </TouchableOpacity>
        </View>

        <ImageLoader
          i18n={i18n}
          uri={gifUrl}
          width={Dimensions.get('window').width / 2.2}
          height={Dimensions.get('window').height / 4.1}
        />
      </View>

      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 15,
          top: 5,
          width: Dimensions.get('window').width - 25,
          height: Dimensions.get('window').height / 2.5,
        }}>
        <View>
          <View
            style={{
              width: width / 1.1,
              marginHorizontal: 5,
              //  marginLeft: 60,
              position: 'absolute',
            }}>
            {inputType === 'timer' ? (
              <TimerInput
                key={0}
                index={index}
                setIndex={0}
                title={title}
                exerciseId={exerciseId}
                category={category}
                type={type}
                doneItem={doneItem}
                inputType={inputType}
                setFinish={setFinish}
                numberOfSets={adjustedNumberOfSets}
                onStoreData={handleStoreData}
                currentIndex={currentIndex}
              />
            ) : (
              Array.from(Array(adjustedNumberOfSets), (e, i) => {
                if (inputType === 'rep' && type !== 'cooldown') {
                  return (
                    <RepsInput
                      key={i}
                      index={index}
                      setIndex={i}
                      title={title}
                      exerciseId={exerciseId}
                      category={category}
                      type={type}
                      doneItem={doneItem}
                      inputType={inputType}
                      numberOfSets={adjustedNumberOfSets}
                      onStoreData={handleStoreData}
                      currentIndex={currentIndex}
                    />
                  );
                } else if (type !== 'cooldown') {
                  return (
                    <WeightAndSetsInput
                      sessionData={sessionData}
                      key={i}
                      index={index}
                      setIndex={i}
                      title={title}
                      exerciseId={exerciseId}
                      category={category}
                      type={type}
                      doneItem={doneItem}
                      inputType={inputType}
                      numberOfSets={adjustedNumberOfSets}
                      onStoreData={handleStoreData}
                      currentIndex={currentIndex}
                    />
                  );
                }
              })
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginHorizontal: 10,
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  //fontWeight: 'bold',
                  color: theme.colors.secondary,
                  fontFamily: 'Vazirmatn',
                }}>
                {i18n.t('set')} {convertToPersianNumbers(currentIndex + 1, RTL)}{' '}
                {i18n.t('of')}{' '}
                {convertToPersianNumbers(adjustedNumberOfSets, RTL)}
              </Text>
            </View>
            {description && (
              <View
                style={{
                  marginHorizontal: 20,
                  marginTop: 40,
                  direction: 'rtl',
                }}>
                <Text
                  style={{
                    fontFamily: 'Vazirmatn',
                    fontSize: 16,
                    textAlign: RTL ? 'left' : 'right',
                    color: theme.colors.secondary,
                  }}>
                  {i18n.t('description')}: {description}
                </Text>
              </View>
            )}
          </View>
        </View>

        {showRest && (
          <RestCounterComponent
            setVisible={setShowRest}
            visible={showRest}
            buttonTitle={i18n.t('skip')}
            RTL={RTL}
          />
        )}
      </View>

      {visible && (
        <Subs
          userId={userId}
          exerciseId={exerciseId}
          setVisible={setVisible}
          visible={visible}
          bodyPart={bodyPart}
          loc={loc}
          category={category}
          handleSubsitute={handleSubsitute}
          type={type}
          allExcerciesIds={allExcerciesIds}
          title={title}
          mainTarget={mainTarget}
          otherTarget={otherTarget}
          target={target}
          userLocation={userLocation}
        />
      )}
      {/* <DrawerList sortedData={sortedData} goToIndex={doneItem} /> */}
      <View
        style={{
          position: 'absolute',
          top: Dimensions.get('window').height / 1.5,
          left: 0,
          right: 0,
          //height: Dimensions.get('window').height / 15,
          backgroundColor: theme.colors.background,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          // borderTopWidth: 0.5,
          borderColor: theme.colors.border,
          paddingTop: 0,
        }}>
        {buttonVisible && (
          <Button
            // disabled={buttondisabled}
            type="outline"
            buttonStyle={{
              backgroundColor: theme.colors.button,
              borderRadius: 12,
              // borderWidth: 1,
              width: Dimensions.get('window').width / 1.1,
              height:
                PixelRatio.get() < 3
                  ? Dimensions.get('window').height / 16
                  : Dimensions.get('window').height / 20,
            }}
            titleStyle={{
              fontSize: PixelRatio.get() < 3 ? 14 : 18,
              fontFamily: 'Vazirmatn',
            }}
            //  onPress={() => doneItem(index)}
            onPress={() => handleButton(childDataMap.data)}>
            {buttonTitle}
          </Button>
        )}
      </View>
    </SafeAreaView>
  );
}

export default React.memo(Item);
