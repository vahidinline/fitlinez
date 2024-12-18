import React, { useState, useContext, useEffect, useRef, memo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import InputSpinner from 'react-native-input-spinner';
import { useTheme } from '@rneui/themed';
import LanguageContext from '../../../../api/langcontext';
import i18nt from '../../../../locales';
import convertToPersianNumbers from '../../../../api/PersianNumber';

function WeightAndSetsInput(props) {
  const {
    index,
    setIndex,
    title,
    category,
    exerciseId,
    onStoreData,
    sessionData,
    currentIndex,
  } = props;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [weight, setWeight] = useState();
  const [reps, setReps] = useState(1);
  const { userLanguage } = useContext(LanguageContext);
  const [setDone, setSetDone] = useState(false);
  const i18n = new I18n(i18nt);
  const timestamp = new Date().toISOString();
  const RTL = userLanguage === 'fa';
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    const done = sessionData.some(
      (sessionItem) =>
        sessionItem.exerciseId === exerciseId &&
        Number(sessionItem.setIndex) === setIndex
    );
    setSessionDone(done);
  }, [setIndex]);

  i18n.locale = userLanguage;
  //console.log('sessionData in WeightAndSetsInput:', sessionData);

  const handleInputChange = async (inputName, inputValue) => {
    if (inputName === 'weight') {
      setWeight(inputValue);
      await AsyncStorage.setItem('weight', JSON.stringify(inputValue));
    } else if (inputName === 'reps') {
      setReps(inputValue);
      await AsyncStorage.setItem('reps', JSON.stringify(inputValue));
    }
  };

  useEffect(() => {
    AsyncStorage.getItem(`${exerciseId}-${setIndex}`).then((res) => {
      // console.log('res and weight in async get input', res);
      if (res !== null) {
        const { weight, reps } = JSON.parse(res);
        setWeight(weight);
        setReps(reps);
      }
    });
  }, []);

  const postfixkg = i18n.t('kg');
  const postfixrep = i18n.t('reps');

  useEffect(() => {
    onStoreData({
      weight,
      reps,
      category,
      exerciseId,
      totalWeight: isNaN(weight) || isNaN(reps) ? 0 : weight * reps,
      title,
      itemIndex: index,
      setIndex,
      timestamp,
      exerciseType: 'weight',
    });
    setSetDone(true);
  }, [weight, reps]);

  return (
    <>
      {currentIndex === setIndex && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            top: 5,
          }}>
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
              backgroundColor: setDone
                ? theme.colors.background
                : theme.colors.red,
            }}
            value={weight ? weight : 0}
            onChange={(value) => handleInputChange('weight', value)}
            style={{
              flex: 1,
              margin: 0,
              marginEnd: 0,
              marginStart: 0,
              shadowColor: 'transparent',
              justifyContent: 'center',
              shadowOpacity: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 12,
              borderRadius: 12,
              borderEndWidth: 1,
              //borderWidth: 1,
              //borderStartWidth: 1,
              // borderEndWidth: 1,
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
              margin: 0,
              justifyContent: 'center',
              shadowColor: 'transparent',
              shadowOpacity: 0,
              borderRadius: 12,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,

              borderStartWidth: 0,
              //borderWidth: 1,
              borderColor: theme.colors.border,
              marginStart: 0,
            }}
            returnKeyType="done"
            skin="clean">
            <Text style={styles.label}>{postfixrep}</Text>
          </InputSpinner>
        </View>
      )}
    </>
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
      left: 3,
      backgroundColor: theme.colors.background,
      color: 'gray',
      fontFamily: 'Vazirmatn',
    },
    button: {
      backgroundColor: '#fff',
      height: 30,
      top: 20,
    },
  });

export default memo(WeightAndSetsInput);
