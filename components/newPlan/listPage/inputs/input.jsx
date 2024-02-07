import React, { useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import i18nt from '../../../../locales/index';
import LanguageContext from '../../../../api/langcontext';
import RestCounter from './counter';
import InputSpinner from 'react-native-input-spinner';
import * as SQLite from 'expo-sqlite';
import { Button, Overlay, useTheme } from '@rneui/themed';
import { SessionContext } from '../../../../api/sessionContext';
import RestCounterComponent from './counter';
import { saveSetsData } from '../../../../api/inputApis';
const db = SQLite.openDatabase('totalWeight.db');

export default function WeightAndSetsInput(props) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 60000); // 60 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  const { index, setIndex, title, category, exerciseId, onStoreData } = props;

  const { setSessionData } = useContext(SessionContext);
  const [weight, setWeight] = useState();
  const [reps, setReps] = useState(1);
  const today = new Date().toISOString().substring(0, 10);
  const { userLanguage } = useContext(LanguageContext);
  const [defaultWeight, setDefaultWeight] = useState('');
  const [defaultReps, setDefaultReps] = useState('');
  const [setDone, setSetDone] = useState(false);
  const i18n = new I18n(i18nt);
  const timestamp = new Date().toISOString();
  const [timeoutId, setTimeoutId] = useState(null);
  const weightRef = useRef();
  const repsRef = useRef();
  i18n.locale = userLanguage;

  useEffect(() => {
    weightRef.current = weight;
  }, [weight]);

  useEffect(() => {
    repsRef.current = reps;
  }, [reps]);
  useEffect(() => {
    // Only set the timeout if both weight and reps are not undefined and not null
    if (
      weight !== undefined &&
      reps !== undefined &&
      weight !== null &&
      reps !== null
    ) {
      // If there's an existing timeout, clear it
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    }
  }, [weight, reps]);

  const handleInputChange = (inputName, inputValue) => {
    if (inputName === 'weight') {
      setWeight(inputValue);
    } else if (inputName === 'reps') {
      setReps(inputValue);
    }
  };

  useEffect(() => {
    AsyncStorage.getItem(`${exerciseId}-${setIndex}`).then((res) => {
      if (res !== null) {
        const { weight, reps } = JSON.parse(res);

        setDefaultWeight(weight);
        setDefaultReps(reps);
        setWeight(weight);
        setReps(reps);
      }
    });
  }, []);

  const handleAddPress = async () => {
    setSessionData((prevState) => [
      ...prevState,
      { setIndex: prevState.length + 1, exerciseId: exerciseId },
    ]);
    // setVisible(!visible);
    //saveUserData();

    await AsyncStorage.setItem(
      `${exerciseId}-${setIndex}`,
      JSON.stringify({ weight: weightRef.current, reps: repsRef.current })
    );
  };

  const postfixkg = 'kg';
  const postfixrep = 'rep';

  useEffect(() => {
    onStoreData({
      weight,
      reps,
      category,
      exerciseId,
      totalWeight: isNaN(weight) || isNaN(reps) ? 0 : weight * reps,
      title,
      itemIndex: index,
      timestamp,
    });
    setSetDone(true);
  }, [weight, reps]);

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.background,
      }}>
      <View
        style={{
          borderRadius: 16,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          marginTop: 5,
          marginBottom: 5,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
        <Text
          style={{
            margin: 5,
            color: '#787680',
            fontSize: 14,
            fontWeight: '500',
            padding: 10,
          }}>
          Set {setIndex + 1}
        </Text>
      </View>
      <InputSpinner
        name="weight"
        type="float"
        max={200}
        min={0}
        step={0.5}
        background={theme.colors.background}
        typingTimeout={2000}
        shadow={false}
        shadowOffset={0}
        inputStyle={{
          fontSize: 20,
          color: theme.colors.secondary,
          backgroundColor: setDone ? theme.colors.background : theme.colors.red,
        }}
        value={weight ? weight : 0}
        onChange={(value) => handleInputChange('weight', value)}
        style={{
          flex: 1,
          margin: 5,
          marginEnd: 0,
          marginStart: 0,
          justifyContent: 'center',
          shadowOpacity: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderRadius: 0,
          borderWidth: 1,
          borderStartWidth: 0,
          borderEndWidth: 0,
          borderColor: theme.colors.border,
        }}
        skin="clean"
        //rounded={false}
        returnKeyType="done">
        <Text style={styles.label}>{postfixkg}</Text>
      </InputSpinner>

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
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderStartWidth: 1,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginStart: 0,
        }}
        skin="clean"
        //rounded={false}
        returnKeyType="done">
        <Text style={styles.label}>{postfixrep}</Text>
      </InputSpinner>
      {/* {visible && (
        <RestCounterComponent
          setVisible={setVisible}
          visible={visible}
          buttonTitle={i18n.t('skip')}
        />
      )} */}
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    input: {
      height: 0,
      flex: 1,
      marginRight: 10,
      width: '50%',
    },
    inputWrapper: {
      flexDirection: 'row',
      width: '100%',
    },
    label: {
      fontSize: 10,
      backgroundColor: '#fff',
      height: 30,
      top: 0,
      left: 0,
      backgroundColor: theme.colors.background,
      color: 'gray',
    },
    button: {
      backgroundColor: '#fff',
      height: 30,
      top: 20,
    },
  });
