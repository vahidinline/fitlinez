import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
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
import Recomand from './recomand';
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
import FitAlert from '../../Alert';
import { saveSetsData } from '../../../api/inputApis';
import RestCounterComponent from './inputs/counter';
import { SessionContext } from '../../../api/sessionContext';
const { width, height } = Dimensions.get('window');

function Item(props) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const [showInstruction, setShowInstruction] = useState(false);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyles(theme); // Call the function inside the component
  const [childDataMap, setChildDataMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [buttonTitle, setButtonTitle] = useState(i18n.t('nextSet'));

  const {
    userId,
    undoneItem,
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
  const [showAlert, setShowAlert] = useState(false);
  const { sessionData, setSessionData } = useContext(SessionContext);

  // console.log('setSessionData', sessionData);

  const handleStoreData = ({
    weight,
    reps,
    category,
    exerciseId,
    totalWeight,
    title,
    itemIndex,
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
      timestamp,
    });
  };

  useEffect(() => {
    if (saveCount + 1 >= adjustedNumberOfSets) {
      if (index >= dataLength - 1) {
        // When it's the last set of the last movement
        setButtonTitle(i18n.t('finishWorkout'));
      } else {
        // When it's the last set, but not the last movement
        setButtonTitle(i18n.t('nextExercise'));
      }
    } else {
      // When there are some remaining sets in the current movement
      setButtonTitle(i18n.t('nextSet'));
    }
  }, [currentIndex, saveCount, adjustedNumberOfSets]);

  if (type === 'warmup' || type === 'cooldown') {
    adjustedNumberOfSets = 1;
  }

  const handleButton = () => {
    // Save new data first.
    saveSetsData(childDataMap);

    setShowRest((prevShowRest) => !prevShowRest);

    setSessionData((prevState) => [
      ...prevState,
      { setIndex: prevState.length + 1, exerciseId: exerciseId },
    ]);

    // Increment the counter.
    setSaveCount((prevCount) => prevCount + 1);

    // Then check if it's the last set.
    if (saveCount + 1 >= adjustedNumberOfSets) {
      console.log('Last set of the movement --');
      // We have saved all the sets, now call the doneItem function.
      doneItem(index);
      if (index >= dataLength - 1) {
        console.log('Last set of the last movement');
        setFinish(true);
      }
    } else {
      // Still need to save some sets.
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }

    // Now, we no longer need the below check
    // because we have already catered for it in the doneItem(index) condition above.
    /* 
      try {
        console.log(`Index: ${index}, dataLength: ${dataLength}`);
        if (index >= dataLength - 1) {
          setFinish(true);
        }
      } catch (error) {
        console.error("Error in handleButton:", error);
      }
    */
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
        <Text style={styles.title}>{title}</Text>
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

        <SessionTimer stoptimer={stoptimer} />
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

      {showAlert && (
        <FitAlert
          toggleDialog={() => setShowAlert(!showAlert)}
          visible={true}
          message="You are not premium user"
          buttonArray={[
            {
              onPress: () => {},
              label: 'OK',
            },
          ]}
        />
      )}

      {inputType !== 'timer' && inputType !== 'rep' && <Recomand />}
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
              if (inputType === 'rep') {
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
              } else {
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
        <Button
          // type="outline"
          buttonStyle={{
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            borderWidth: 1,
            width: Dimensions.get('window').width / 2.4,
            height: Dimensions.get('window').height / 20,
            borderColor: theme.colors.border,
          }}
          title={i18n.t('previousExercise')}
          titleStyle={{
            color: theme.colors.secondary,
          }}
          onPress={() => undoneItem(index)}
        />

        <Button
          type="outline"
          buttonStyle={{
            backgroundColor: theme.colors.button,
            borderRadius: 12,
            borderWidth: 1,
            width: Dimensions.get('window').width / 2.4,
            height: Dimensions.get('window').height / 20,
          }}
          //  onPress={() => doneItem(index)}
          onPress={() => handleButton(childDataMap.data)}>
          {buttonTitle}
        </Button>
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

export default Item;
