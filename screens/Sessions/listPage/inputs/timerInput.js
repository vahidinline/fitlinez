import React, { useState, useContext, useEffect, memo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Dimensions } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { I18n } from 'i18n-js';
import i18nt from '../../../../locales/index';
import LanguageContext from '../../../../api/langcontext';
import { useTheme } from '@rneui/themed';
import { SessionContext } from '../../../../api/sessionContext';
import CountDown from './countDown';
//import { saveSetsData } from '../../../../api/inputApis';
import { duration } from 'moment';

function TimerInput({
  index,
  setIndex,
  title,
  category,
  exerciseId,
  setFinish,
  doneItem,
  onStoreData,
}) {
  const [timeoutId, setTimeoutId] = useState(null);
  const { setSessionData } = useContext(SessionContext);
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [time, setTime] = useState('0');
  const [reps, setReps] = useState('0');
  const [showButton, setShowButton] = useState(false);
  const { userLanguage } = useContext(LanguageContext);
  const [defaultTime, setDefaultTime] = useState('');
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const { theme } = useTheme();

  const handleInputChange = (inputName, inputValue) => {
    if (inputValue !== '' && inputName === 'timer') {
      setShowButton(true);
    } else {
      setShowButton(false);
    }

    if (defaultTime) {
      const prevTime = parseFloat(defaultTime);
      const newWeight = parseFloat(inputName === 'timer' ? inputValue : time);

      showMessage({
        message: 'New record!',
        type: 'success',
      });
    }
    setTimeoutId(
      setTimeout(() => {
        handleAddPress();
      }, 2000)
    );
  };

  useEffect(() => {
    AsyncStorage.getItem(`${index}-${setIndex}`).then((res) => {
      if (res !== null) {
        const { time } = JSON.parse(res);
        console.log('time', time);
        setDefaultTime(time.toString());
      }
    });
  }, []);

  // Add handleStopwatchToggle function
  const handleStopwatchToggle = () => {
    setIsStopwatchStart(!isStopwatchStart);
    setResetStopwatch(false);
  };

  const handleAddPress = async () => {
    // Perform any desired action with weight and reps values
    setSessionData((prevState) => [
      ...prevState,
      { setIndex: prevState.length + 1, exerciseId: exerciseId },
    ]);

    saveUserData();
    // Save new values in AsyncStorage
    try {
      AsyncStorage.setItem(
        `${index}-${setIndex}`,
        JSON.stringify({ time: stopwatchTime.toString() })
      ).then(() => console.log('saved'));
    } catch (e) {
      console.log(e);
    }

    setShowButton(false);
    if (category === 'Cardio') {
      setFinish(true);
    } else {
      doneItem(index);
    }
  };
  useEffect(() => {
    setReps(stopwatchTime.toString());
  }, [stopwatchTime]);

  const saveUserData = () => {
    const dataToSave = {
      weight: 0,
      reps: 0,
      category,
      exerciseId,
      totalWeight: 0,
      title,
      itemIndex: index,
      exercideType: 'timer',
      duration: stopwatchTime,
    };
    // saveSetsData(dataToSave);
  };

  useEffect(() => {
    onStoreData({
      weight: 0,
      reps,
      category,
      exerciseId,
      totalWeight: 0,
      title,
      itemIndex: index,
      setIndex,
      timestamp: new Date().toISOString(),
      exerciseType: 'timer',
      duration: stopwatchTime,
    });
  }, [stopwatchTime]);

  return (
    <View
      style={{
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          // width: Dimensions.get('window').width / 1.35,
          flexDirection: 'row',
          height: 60,
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderRadius: 12,
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginHorizontal: 0,
          // marginRight: 10,
          top: 5,
        }}>
        <CountDown
          handleInputChange={handleInputChange}
          setStopwatchTime={setStopwatchTime}
        />

        {/* {visible && <RestCounterComponent />} */}
      </View>
    </View>
  );
}

export default memo(TimerInput);
