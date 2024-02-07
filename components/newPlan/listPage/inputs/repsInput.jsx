import React, { useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { showMessage } from 'react-native-flash-message';
import { I18n } from 'i18n-js';
import i18nt from '../../../../locales/index';
import LanguageContext from '../../../../api/langcontext';
import RestCounter from './counter';
import InputSpinner from 'react-native-input-spinner';
import { Button, Overlay, useTheme } from '@rneui/themed';
import { SessionContext } from '../../../../api/sessionContext';
import { schedulePushNotification } from '../../../../api/notification';
import RestCounterComponent from './counter';
import { saveSetsData } from '../../../../api/inputApis';

export default function RepsInput({
  index,
  setIndex,
  title,
  category,
  exerciseId,
  type,
  doneItem,
  onStoreData,
}) {
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setVisible(false);
  //   }, 60000); // 60 seconds
  //   return () => clearTimeout(timer); // Cleanup the timer
  // }, [visible]);

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);
  const { setSessionData } = useContext(SessionContext);
  const [reps, setReps] = useState();
  const [showButton, setShowButton] = useState(false);
  const today = new Date().toISOString().substring(0, 10);
  const { userLanguage } = useContext(LanguageContext);
  const [defaultWeight, setDefaultWeight] = useState('');
  const [defaultReps, setDefaultReps] = useState('');
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [timeoutId, setTimeoutId] = useState(null);
  const [showRestcounter, setShowRestcounter] = useState(false);
  const timestamp = new Date().toISOString();

  // useEffect(() => {
  //   return () => {
  //     if (timeoutId !== null) {
  //       clearTimeout(timeoutId);
  //     }
  //   };
  // }, [reps]);

  useEffect(() => {
    onStoreData({
      weight: 0,
      reps,
      category,
      exerciseId,
      totalWeight: 0,
      title,
      itemIndex: index,
      timestamp,
    });
    //handleAddPress();
  }, [reps]);

  const checkUserRecord = async () => {
    if (defaultReps < reps) {
      const result = await AsyncStorage.getItem(today);
      if (result === null) {
        AsyncStorage.setItem(
          today,
          JSON.stringify([
            {
              title,

              repRecord: defaultReps - reps,
            },
          ])
        );
      } else {
        let data = JSON.parse(result);
        if (!Array.isArray(data)) {
          data = [data];
        }
        const index = data.findIndex(function (item) {
          return item.title === title;
        });
        if (index === -1) {
          data.push({
            title,

            repRecord: defaultReps - reps,
          });
        } else {
          data[exerciseId.$oid] = { reps, title, category };
        }
        AsyncStorage.setItem(today, JSON.stringify(data));
      }
    }
  };

  const handleInputChange = (inputName, inputValue) => {
    if (inputName === 'reps') {
      setReps(inputValue);
      setShowButton(true);
    }

    // Compare with previous values and show a message if higher
    if (defaultReps) {
      const prevReps = parseFloat(defaultReps);

      const newReps = parseFloat(inputName === 'reps' ? inputValue : reps);
      if (newReps > prevReps) {
        showMessage({
          message: 'New record!',
          type: 'success',
        });
      }
    }
    // Set a timeout to call handleAddPress
    // if (timeoutId !== null) {
    //   clearTimeout(timeoutId);
    // }
    // setTimeoutId(
    //   setTimeout(() => {
    //     handleAddPress();
    //     setShowRestcounter(true);
    //   }, 2000)
    // );
  };

  useEffect(() => {
    AsyncStorage.getItem(`${exerciseId}-${setIndex}`).then((res) => {
      if (res !== null) {
        const { reps } = JSON.parse(res);

        setDefaultReps(reps);

        setReps(reps);
      }
    });
  }, []);
  const postfixrep = 'rep';
  const handleAddPress = async () => {
    setSessionData((prevState) => [
      ...prevState,
      { setIndex: prevState.length + 1, exerciseId: exerciseId, type: type },
    ]);
    // Perform any desired action with weight and reps values

    // saveUserData();
    checkUserRecord();
    await AsyncStorage.setItem(
      `${exerciseId}-${setIndex}`,
      JSON.stringify({ reps })
    );

    // Reset the inputs
    // setWeight
    // setReps('0');

    setShowButton(false);

    if (type === 'warmup') {
      doneItem(index);
    } else {
      setVisible(!visible);
    }
  };

  return (
    <View
      style={{
        sflex: 1,
        flexDirection: 'row',
        //paddingRight: 10,
        height: 70,
      }}>
      <InputSpinner
        background={theme.colors.background}
        typingTimeout={2000}
        shadow={false}
        shadowOffset={0}
        max={500}
        min={0}
        step={1}
        inputStyle={{
          fontSize: 20,
          color: theme.colors.secondary,
        }}
        value={reps ? reps : 0}
        onChange={(value) => handleInputChange('reps', value)}
        style={{
          flex: 1,
          margin: 5,
          justifyContent: 'center',
          shadowOpacity: 0,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
        skin="clean"
        //rounded={false}
        returnKeyType="done"></InputSpinner>

      {visible && (
        <RestCounterComponent
          setVisible={setVisible}
          visible={visible}
          buttonTitle={i18n.t('skip')}
        />
      )}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    input: {
      // backgroundColor: '#fff',
      //height: 40,
      // flex: 1,
      // marginRight: 10,
    },
    inputWrapper: {
      flexDirection: 'row',
      // width: '100%',
    },
    label: {
      // backgroundColor: theme.colors.black,
      height: 30,
      top: 6,
      right: 60,
      // color: 'gray',
    },
    button: {
      // backgroundColor: '#fff',
      height: 30,
      top: 20,
      color: 'gray',
    },
  });
