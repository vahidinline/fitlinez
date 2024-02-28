import React, { useState, useContext, useEffect, memo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { I18n } from 'i18n-js';
import i18nt from '../../../../locales/index';
import LanguageContext from '../../../../api/langcontext';
import InputSpinner from 'react-native-input-spinner';
import { useTheme } from '@rneui/themed';
import RestCounterComponent from './counter';

function RepsInput(props) {
  const { index, setIndex, title, category, exerciseId, onStoreData } = props;
  const { theme } = useTheme();
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

  // const checkUserRecord = async () => {
  //   if (defaultReps < reps) {
  //     const result = await AsyncStorage.getItem(today);
  //     if (result === null) {
  //       AsyncStorage.setItem(
  //         today,
  //         JSON.stringify([
  //           {
  //             title,

  //             repRecord: defaultReps - reps,
  //           },
  //         ])
  //       );
  //     } else {
  //       let data = JSON.parse(result);
  //       if (!Array.isArray(data)) {
  //         data = [data];
  //       }
  //       const index = data.findIndex(function (item) {
  //         return item.title === title;
  //       });
  //       if (index === -1) {
  //         data.push({
  //           title,

  //           repRecord: defaultReps - reps,
  //         });
  //       } else {
  //         data[exerciseId.$oid] = { reps, title, category };
  //       }
  //       AsyncStorage.setItem(today, JSON.stringify(data));
  //     }
  //   }
  // };

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
          shadowColor: 'transparent',
          borderColor: theme.colors.border,
        }}
        skin="clean"
        //rounded={false}
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
  );
}

export default memo(RepsInput);
