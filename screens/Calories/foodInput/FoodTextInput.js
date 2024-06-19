import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { sendInitialReq } from '../../../api/sendFoodQuery';
import { Button } from '@rneui/base';
import { Iconclose } from '../../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FoodTextInput({
  setFoodItems,
  setStatus,
  userInput,
  setUserInput,
  setInputStatus,
  selectedMeal,
  status,
  i18n,
  userId,
  RTL,
}) {
  const { theme } = useTheme();
  const [typeStatus, setTypeStatus] = useState('idle');
  // Load the existing value from AsyncStorage on component mount
  useEffect(() => {
    const getStoredValue = async () => {
      const storedValue = await AsyncStorage.getItem('foodInput');
      if (storedValue) {
        setUserInput(storedValue);
      }
    };
    getStoredValue();
  }, []);

  const handleInput = async () => {
    setStatus('loading');

    // Save the user input to AsyncStorage
    await AsyncStorage.setItem('foodInput', userInput);

    const res = await sendInitialReq(userInput, userId, selectedMeal.value);
    if (res) {
      //console.log('res in FoodTextInput', res);
      setFoodItems(res);
      setStatus('initialReqSent');
    } else {
      setStatus('error');
    }
  };

  return (
    <View
      style={[
        styles.footerContainer,
        {
          bottom:
            typeStatus === 'focused' ? Dimensions.get('window').height / 3 : 0,
        },
      ]}>
      <Pressable
        onPress={() => setInputStatus('idle')}
        style={styles.closeButton}>
        <Iconclose size={30} color={theme.colors.grey2} />
      </Pressable>
      <TextInput
        value={userInput}
        returnKeyType="done"
        returnKeyLabel="Done"
        onFocus={() => setTypeStatus('focused')}
        onBlur={() => setTypeStatus('idle')}
        multiline={true}
        numberOfLines={4}
        onChangeText={setUserInput}
        style={[styles.verticallySpaced, { direction: RTL ? 'rtl' : 'ltr' }]}
        placeholder={i18n.t('enterFoodPlaceholder')}
      />
      <View style={styles.buttonContainer}>
        <Button
          disabled={!userInput || userInput.length < 5}
          buttonStyle={styles.saveButton}
          titleStyle={{ fontFamily: 'Vazirmatn' }}
          onPress={handleInput}
          title={i18n.t('foodsearch')}
        />
      </View>
    </View>
  );
}

export default FoodTextInput;

const styles = StyleSheet.create({
  footerContainer: {
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 0.3,
    borderColor: 'grey',
    height: 240,
  },
  verticallySpaced: {
    marginVertical: 10,
    borderWidth: 0.3,
    marginHorizontal: 10,
    height: 100,
    borderRadius: 5,
    padding: 10,
    width: '95%',
    textAlignVertical: 'top',
    fontFamily: 'Vazirmatn',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    zIndex: 1000,
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    top: 10,
  },
  saveButton: {
    padding: 10,
    width: '95%',
    height: 50,
    backgroundColor: '#5B5891',
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    fontFamily: 'Vazirmatn',
  },
});
