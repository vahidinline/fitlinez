import React, { useState, useContext, useEffect, memo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { I18n } from 'i18n-js';
import i18nt from '../../../../locales/index';
import LanguageContext from '../../../../api/langcontext';
import InputSpinner from 'react-native-input-spinner';
import { useTheme } from '@rneui/themed';
import RestCounterComponent from './counter';

function RepsInput(props) {
  const {
    index,
    setIndex,
    title,
    category,
    exerciseId,
    onStoreData,
    currentIndex,
  } = props;

  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [visible, setVisible] = useState(false);
  const [reps, setReps] = useState();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const timestamp = new Date().toISOString();

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
      timestamp,
      exerciseType: 'reps',
    });
  }, [reps]);

  useEffect(() => {
    AsyncStorage.getItem(`${exerciseId}-${setIndex}`).then((res) => {
      //console.log('res in async get repinput', res);
      if (res !== null) {
        const { reps } = JSON.parse(res);
        setReps(reps);
      }
    });
  }, []);

  const handleInputChange = (inputName, inputValue) => {
    if (inputName === 'reps') {
      setReps(inputValue);
    }

    // Compare with previous values and show a message if higher
    if (reps) {
      const prevReps = parseFloat(reps);

      const newReps = parseFloat(inputName === 'reps' ? inputValue : reps);
      if (newReps > prevReps) {
        showMessage({
          message: 'New record!',
          type: 'success',
        });
      }
    }
  };

  const postfixrep = 'rep';

  return (
    <>
      {currentIndex === setIndex && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: theme.colors.background,
          }}>
          <InputSpinner
            background={theme.colors.background}
            typingTimeout={2000}
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
              marginEnd: 0,
              marginStart: 0,
              shadowColor: 'transparent',
              justifyContent: 'center',
              shadowOpacity: 0,

              borderWidth: 1,

              borderRadius: 12,

              borderColor: theme.colors.border,
              marginStart: 0,
              marginTop: 5,
              marginBottom: 5,
              width: '50%',
            }}
            skin="clean"
            returnKeyType="done"
          />

          {visible && (
            <RestCounterComponent
              setVisible={setVisible}
              visible={visible}
              buttonTitle={i18n.t('skip')}
            />
          )}
        </View>
      )}
    </>
  );
}

export default memo(RepsInput);

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
