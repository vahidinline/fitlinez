import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import WeightAndSetsInput from './inputs/input';
import RepsInput from './inputs/repsInput';
import { StyleSheet } from 'react-native';
import { I18n } from 'i18n-js';
import SessionTimer from '../../../components/timer/sessionTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18nt from '../../../locales';
import LanguageContext from '../../../api/langcontext';
import { SessionContext } from '../../../api/sessionContext';
import DrawerList from './drawer';
import ImageLoader from './image';
import TimerInput from './inputs/timerInput';
import RestCounterComponent from './inputs/counter';
import Instruction from './instruction';
import Subs from './subs';
import * as Icons from '../../marketplace/filters/icons';
import AiAskHelpIndex from '../../AiAskHelp/AiAskHelpIndex';
import { checkUserAccess } from '../../../api/checkTestAccess';
import Recommand from './recomand';
import api from '../../../api/api';
import { updateSession } from '../../../api/workoutSessionTracker';
import { useNavigation } from '@react-navigation/native';
// import BannerAdMob from '../../../api/AdMob/BannerComponent';
import AdModal from '../../../components/AdModal/AdModalIndex';
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
  alertVisible,
  loc,
  bodyPart,
  category,
  handleSubsitute,
  allExcerciesIds,
  mainTarget,
  otherTarget,
  target,
  userLocation,
  setAlertVisible,
  setSaveTimer,
  dataLength,
  description,
}) {
  const { userLanguage } = useContext(LanguageContext);
  const { IconArrowRight, IconInfo, IconMenu, IconSub } = Icons;
  const i18n = new I18n(i18nt);
  const [showInstruction, setShowInstruction] = useState(false);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [childDataMap, setChildDataMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [buttonTitle, setButtonTitle] = useState(i18n.t('nextSet'));
  const [showDrawer, setShowDrawer] = useState(false);
  const [visible, setVisible] = useState(false);
  let adjustedNumberOfSets = 4;
  const [showRest, setShowRest] = useState(false);
  const { sessionData, setSessionData } = useContext(SessionContext);
  const [userTestAccess, setUserTestAccess] = useState(false);
  let buttonVisible = true;
  const [currentSet, setCurrentSet] = useState(0);
  const navigation = useNavigation();
  if (index >= dataLength - 1) {
    buttonVisible = false;
  }
  const handleAccess = async () => {
    const status = await checkUserAccess(userId);
    setUserTestAccess(status);
  };
  useEffect(() => {
    handleAccess();
  }, []);
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

  const handleCloseSession = async () => {
    setAlertVisible(true);
  };

  const closeSession = async () => {
    console.log('closing session');
    const sessionId = await AsyncStorage.getItem('sessionId');
    const res = await updateSession({
      sessionId,
      status: 'uncompleted',
    });
    if (res) {
      console.log('session closed');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
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
        // backgroundColor: theme.colors.warning,
        width: Dimensions.get('window').width,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: Dimensions.get('window').width / 1.1,
          height: Dimensions.get('window').height / 20,
          backgroundColor: theme.colors.background,
          marginHorizontal: 15,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',

            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.title,
              {
                fontSize: PixelRatio.get() > 2 ? 20 : 22,
                // fontWeight: 'bold',
                fontFamily: 'Vazirmatn',
                flexWrap: 'wrap',
                width: Dimensions.get('window').width / 1.1,
                textAlign: 'center',
                top: 5,
              },
            ]}>
            {title}
          </Text>
        </View>
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
          marginHorizontal: 15,
        }}>
        <View
          style={{
            position: 'absolute',
            marginHorizontal: 10,
            marginVertical: 10,
            top: 0,
            left: 0,
            zIndex: 100,
          }}>
          <AiAskHelpIndex
            title={title}
            category={category}
            userLanguage={userLanguage}
            exerciseId={exerciseId}
            i18n={i18n}
          />
        </View>
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

      {inputType !== 'timer' && inputType !== 'rep' && <Recommand />}

      <View
        style={{
          flexDirection: 'column',
          marginHorizontal: 15,
          top: 5,
          width: Dimensions.get('window').width - 25,
          height: Dimensions.get('window').height / 2.5,
        }}>
        {/* <ScrollView
          style={{
            marginTop: 5,
            marginHorizontal: 10,
            width: Dimensions.get('window').width - 20,
          }}> */}
        <View
          style={
            {
              // width: Dimensions.get('window').width / 1.3,
              //flexDirection: 'row',
            }
          }>
          {/* <DrawerList
            currentIndex={currentIndex}
            exerciseId={exerciseId}
            sessionData={sessionData}
            showDrawer={showDrawer}
            handleDrawer={setShowDrawer}
            title={title}
            sortedData={sortedData}
            userLanguage={userLanguage}
            goToIndex={goToIndex}
            index={index}
            //img={gifUrl}
          /> */}
          <View
            style={{
              width: Dimensions.get('window').width / 1.3,
              marginLeft: 65,
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
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 10,
                marginVertical: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  //fontWeight: 'bold',
                  color: theme.colors.text,
                  fontFamily: 'Vazirmatn',
                }}>
                {i18n.t('set')} {currentIndex + 1} / {adjustedNumberOfSets}
              </Text>
            </View>
            {description && (
              <View
                style={{
                  marginHorizontal: 10,
                  marginVertical: 10,
                  direction: 'rtl',
                }}>
                <Text
                  style={{
                    fontFamily: 'Vazirmatn',
                    fontSize: 16,
                    textAlign: RTL ? 'left' : 'right',
                  }}>
                  {i18n.t('description')}: {description}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* </ScrollView> */}

        {showRest && (
          <RestCounterComponent
            setVisible={setShowRest}
            visible={showRest}
            buttonTitle={i18n.t('skip')}
          />
        )}
      </View>
      <AdModal
        visible={alertVisible}
        title={i18n.t('closeSession')}
        message={i18n.t('closeSessionMessage')}
        onConfirm={closeSession}
        onCancel={() => setAlertVisible(false)}
      />
      {showInstruction ? (
        <Instruction
          title={i18n.t('description')}
          openInstruction={showInstruction}
          setOpenInstruction={setShowInstruction}
          userLanguage={userLanguage}
          instructor={description}
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
          top: Dimensions.get('window').height / 1.3,
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

      {/* <View
        style={{
          position: 'absolute',
          bottom: -100,
          //marginHorizontal: 10,
          zIndex: 100,
        }}>
        <BannerAdMob />
      </View> */}
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
      fontFamily: 'Vazirmatn',
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
