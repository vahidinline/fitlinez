import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import WeightAndSetsInput from './inputs/input';
import RepsInput from './inputs/repsInput';
import { StyleSheet } from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
import TimerInput from './inputs/timerInput';
import Subs from './subs';
import Instruction from './instruction';
import ImageLoader from './image';
import {
  IconArrowRight,
  IconInfo,
  IconMenu,
  IconSub,
} from '../../../screens/marketplace/filters/icons';
import SessionTimer from '../../timer/sessionTimer';
import DrawerList from './drawer';
import RestCounterComponent from './inputs/counter';
import { SessionContext } from '../../../api/sessionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimeSpentContext } from '../../../api/TimeSpentContext';
const { width, height } = Dimensions.get('window');

function Item(props) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const [showInstruction, setShowInstruction] = useState(false);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [childDataMap, setChildDataMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [buttonTitle, setButtonTitle] = useState(i18n.t('nextSet'));
  const [saveTimer, setSaveTimer] = useState(false);
  const {
    userId,
    doneItem,
    exerciseId,
    title,
    index,
    gifUrl,
    instructor,
    faInstructor,
    inputType,
    setFinish,
    type,
    loc,
    bodyPart,
    category,
    handleSubsitute,
    allExcerciesIds,
    mainTarget,
    otherTarget,
    target,
    userLocation,
    stoptimer,
    sortedData,
    goToIndex,
    dataLength,
  } = props;
  const [showDrawer, setShowDrawer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [numberOfSets, setNumberOfSets] = useState(3);
  let adjustedNumberOfSets = numberOfSets;
  const [showRest, setShowRest] = useState(false);
  const RTL = userLanguage === 'fa';
  const { sessionData, setSessionData } = useContext(SessionContext);

  let buttonVisible = true;
  if (index >= dataLength - 1) {
    buttonVisible = false;
  }

  const handleStoreData = ({
    weight,
    reps,
    category,
    exerciseId,
    totalWeight,
    title,
    itemIndex,
    setIndex,
    timestamp,
  }) => {
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

      // Check if oldValue is null, undefined or NaN and assign 0 if true
      if (oldValue === null || oldValue === undefined || isNaN(oldValue)) {
        console.log('oldValue is null, undefined or NaN', oldValue);
        oldValue = 0;
      }

      const totalWeight = oldValue ? Number(oldValue) + weight : weight;
      console.log('totalWeight', totalWeight);
      await AsyncStorage.setItem('@total_weight', totalWeight.toString());
    } catch (error) {
      console.error('Error updating total weight', error);
    }
  };

  useEffect(() => {
    if (saveCount + 1 >= adjustedNumberOfSets) {
      if (index >= dataLength - 1) {
        // setButtonDisabled(!buttonVisible);
        //setButtonTitle(i18n.t('finishWorkout'));
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
    //console.log('currentExerciseState', data);
    //store sum of all sets totalWeight in async storage

    const jsonValue = JSON.stringify(data);
    try {
      await AsyncStorage.setItem('@current_exercise_state', jsonValue);
    } catch (err) {
      console.error('Error saving data', err);
    }
  };

  const handleButton = async () => {
    saveExerciseState(childDataMap);

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
        console.log('into count >= adjustedNumberOfSets');
        if (index >= dataLength - 1) {
          // setFinish(true);
        } else {
          console.log('into else');
          doneItem(index);
        }
      } else {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
      if (count >= adjustedNumberOfSets && index >= dataLength - 1) {
        console.log('into count >= adjustedNumberOfSets');
        // doneItem(index);
        setFinish(true);
      }

      return count;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'position' : 'height'}
      style={{
        position: 'absolute',
        top: -10,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.background,
        width: Dimensions.get('window').width,
        // height: Dimensions.get('window').height,
      }}>
      {showDrawer && (
        <DrawerList
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          title={title}
          sortedData={sortedData}
          userLanguage={userLanguage}
          goToIndex={goToIndex}
          index={index}
          //img={gifUrl}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height / 15,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity onPress={() => setShowDrawer(!showDrawer)}>
          <IconMenu />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            {
              fontSize: PixelRatio.get() > 2 ? 12 : 18,
            },
          ]}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => setShowInstruction(true)}>
          <IconInfo />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 10,
          backgroundColor: theme.colors.background,
          paddingHorizontal: 10,
          borderWidth: 0.5,
          borderColor: theme.colors.border,
          borderRadius: 16,
          margin: 20,
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
              fontWeight: '500',
              fontSize: 14,
              top: 2,
              marginRight: 10,
            }}>
            {i18n.t('SubstituteWorkout')}
          </Text>
          <IconSub />
        </TouchableOpacity>

        <SessionTimer
          saveTimer={saveTimer}
          setSaveTimer={setSaveTimer}
          stoptimer={stoptimer}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
          }}
          onPress={() => setFinish(true)}>
          <Text
            style={{
              color: theme.colors.secondary,
              fontWeight: '500',
              fontSize: 14,
              top: 2,
              marginLeft: 10,
            }}>
            {i18n.t('finishWorkout')}
          </Text>
          <IconArrowRight />
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: 'relative',
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 3.8,
          backgroundColor: '#fff',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginHorizontal: 20,
        }}>
        <ImageLoader
          uri={gifUrl}
          width={Dimensions.get('window').width / 2.2}
          height={Dimensions.get('window').height / 4.1}
        />
      </View>

      {/* {inputType !== 'timer' && inputType !== 'rep' && <Recomand />} */}
      <View
        style={{
          flexDirection: 'row',
        }}>
        <ScrollView
          style={{
            marginTop: 15,
            marginHorizontal: 15,
            width: Dimensions.get('window').width - 20,
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
        </ScrollView>

        {showRest && (
          <RestCounterComponent
            setVisible={setShowRest}
            visible={showRest}
            buttonTitle={i18n.t('skip')}
          />
        )}
      </View>
      {showInstruction ? (
        <Instruction
          title={i18n.t('instructions')}
          openInstruction={showInstruction}
          setOpenInstruction={setShowInstruction}
          userLanguage={userLanguage}
          instructor={instructor}
          faInstructor={faInstructor}
        />
      ) : null}

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

      <View
        style={{
          position: 'absolute',
          top: Dimensions.get('window').height / 1.2,
          left: 0,
          right: 0,
          //height: Dimensions.get('window').height / 15,
          backgroundColor: theme.colors.background,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          borderTopWidth: 0.5,
          borderColor: theme.colors.border,
          paddingTop: 10,
        }}>
        {buttonVisible && (
          <Button
            // disabled={buttondisabled}
            type="outline"
            buttonStyle={{
              backgroundColor: theme.colors.button,
              borderRadius: 12,
              borderWidth: 1,
              width: Dimensions.get('window').width / 1.1,
              height:
                PixelRatio.get() < 3
                  ? Dimensions.get('window').height / 16
                  : Dimensions.get('window').height / 20,
            }}
            titleStyle={{
              fontSize: PixelRatio.get() < 3 ? 14 : 18,
            }}
            //  onPress={() => doneItem(index)}
            onPress={() => handleButton(childDataMap.data)}>
            {buttonTitle}
          </Button>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      top: Platform.OS === 'ios' ? 0 : 10,
    },
    header: {
      paddingTop: 20,
      alignItems: 'center',
      textAlign: 'center',
    },
    item: {
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      height: height,
    },
    title: {
      fontSize: 20,
      fontWeight: '400',
      color: '#3e3b6c',
      textAlign: 'left',
      //alignItems: 'left',
      marginLeft: 10,
    },
    doneText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'green',
    },
    fab: {
      // position: 'absolute',
      margin: 2,
      width: 55,
      left: 0,
      bottom: 0,
      backgroundColor: 'blue',
    },
    button: {
      height: 35,
      backgroundColor: '#3f51b5',
    },
  });

export default React.memo(Item);
