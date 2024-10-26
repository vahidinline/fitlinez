import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';
import { sendInitialReq } from '../../../api/sendFoodQuery';
import { Button } from '@rneui/base';
import { Text, useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../../api/context';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import { IconSearch, IconWarning } from '../../marketplace/filters/icons';
import TempfoodItems from '../TempfoodItems';
import FitlinezLoading from '../../../components/FitlinezLoading';
import { ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function FoodTextInput({
  selectedMeal,
  userInput,
  setUserInput,
  status,
  setStatus,
  setFoodItems,
  foodItems,
}) {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';
  const navigator = useNavigation();
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
    // console.log('userInput in good', userInput);

    const res = await sendInitialReq(
      userInput,
      userId,
      selectedMeal,
      setStatus,
      i18n
    );
    if (res) {
      // console.log('res in FoodTextInput', res.data);

      try {
        navigator.navigate('TempfoodItems', {
          foodItems: res.data,
          setStatus: setStatus,
        });
      } catch (e) {
        console.log('error in FoodTextInput', e);
      }
      //setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    <View style={styles.container}>
      {status === 'loading' && (
        <View
          style={{
            marginVertical: 10,
          }}>
          <FitlinezLoading />
          {/* <Text style={styles.hintText}>{i18n.t('gettingCalories')}</Text>
          <ActivityIndicator size="small" color="#0000ff" /> */}
        </View>
      )}
      {status === 'error' && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.warning,
            width: Dimensions.get('window').width / 1.2,
            height: Dimensions.get('window').height / 5,
            marginHorizontal: 10,
            marginVertical: 10,
            borderRadius: 8,
          }}>
          <IconWarning color={theme.colors.white} size={50} />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: theme.colors.white,
              margin: 20,
              marginBottom: 10,
              fontFamily: 'Vazirmatn',
            }}>
            {i18n.t('error')}
          </Text>
        </View>
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flexDirection: 'column',
          }}>
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>{i18n.t('foodTextInputHint')}</Text>
          </View>
          <TextInput
            value={userInput}
            returnKeyType="done"
            returnKeyLabel="Done"
            multiline={true}
            numberOfLines={1}
            onChangeText={setUserInput}
            style={[
              styles.verticallySpaced,
              { textAlign: RTL ? 'right' : 'left' },
            ]}
            placeholder={i18n.t('enterFoodPlaceholder')}
          />
          <View style={styles.buttonContainer}>
            <Button
              disabled={!userInput || userInput.length < 5}
              buttonStyle={styles.saveButton}
              titleStyle={{
                fontFamily: 'Vazirmatn',

                color: theme.colors.secondary,
              }}
              onPress={handleInput}>
              <IconSearch color={theme.colors.white} />
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

export default FoodTextInput;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
      direction: RTL ? 'rtl' : 'ltr',
    },
    hintBox: {
      direction: RTL ? 'rtl' : 'ltr',
    },
    hintText: {
      //padding: 10,
      color: theme.colors.grey2,
      //width: '30%',
      // height: 50,on:
      textAlign: 'center',

      backgroundColor: 'transparent',
      borderRadius: 5,
      marginHorizontal: 10,
      marginBottom: 10,
      alignItems: 'center',
      fontFamily: 'Vazirmatn',
      // textAlign: RTL ? 'left' : 'right',
    },
    footerContainer: {
      position: 'absolute',
      bottom: 0,

      padding: 20,
      flexDirection: 'column',
      justifyContent: 'center',
      //backgroundColor: 'white',
      marginHorizontal: 15,
      marginVertical: 10,
      borderRadius: 10,
      borderWidth: 0.3,
      borderColor: 'grey',
      height: 240,
    },
    verticallySpaced: {
      // marginVertical: 10,
      borderWidth: 0.2,
      marginHorizontal: 10,
      height: 100,
      borderColor: theme.colors.border,
      borderWidth: 0.7,
      borderRadius: 5,
      padding: 10,
      width: Dimensions.get('window').width / 1.2,
      // width: '80%',
      textAlignVertical: 'top',
      fontFamily: 'Vazirmatn',
    },

    saveButton: {
      //padding: 10,
      width: Dimensions.get('window').width / 1.2,
      // height: 50,
      backgroundColor: theme.colors.button,
      borderRadius: 5,
      marginHorizontal: 10,
      marginVertical: 20,
      alignItems: 'center',
      fontFamily: 'Vazirmatn',
    },
  });
