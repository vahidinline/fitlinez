import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
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

function FoodTextInput({ selectedMeal }) {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const RTL = userLanguage === 'fa';
  const [status, setStatus] = useState('idle');
  const [userInput, setUserInput] = useState('');
  const [foodItems, setFoodItems] = useState([]);

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
    console.log('userInput in good', userInput);

    const res = await sendInitialReq(
      userInput,
      userId,
      selectedMeal,
      setStatus
    );
    if (res) {
      console.log('res in FoodTextInput', res);
      setFoodItems(res);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {status === 'success' && (
        <TempfoodItems
          foodItems={foodItems}
          userId={userId}
          selectedMeal={selectedMeal}
          setStatus={setStatus}
          i18n={i18n}
        />
      )}
      <View style={styles.hintBox}>
        <Text style={styles.hintText}>{i18n.t('foodTextInputHint')}</Text>
      </View>
      {status === 'loading' && <FitlinezLoading />}
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
          {/* <Button
            buttonStyle={{
              //backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.primary,
              borderWidth: 0.2,
              margin: 10,
              borderRadius: 10,
              height: 40,
              width: 100,
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontSize: 15,
              // fontWeight: 'bold',
              fontFamily: 'Vazirmatn',
            }}
            title={i18n.t('retry')}
            onPress={() => setStatus('mealInitialized')}
          /> */}
        </View>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            // flex: 1,
            // position: 'absolute',
            //bottom: 0,
            // top: Dimensions.get('window').height / 1.8,
            flexDirection: 'column',
          }}>
          <TextInput
            value={userInput}
            returnKeyType="done"
            returnKeyLabel="Done"
            // onFocus={() => setStatus('focused')}
            // onBlur={() => setStatus('idle')}
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
              onPress={handleInput}
              // title={i18n.t('foodsearch')}
            >
              <IconSearch color={theme.colors.white} />
            </Button>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default FoodTextInput;

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    hintBox: {},
    hintText: {
      //padding: 10,
      color: theme.colors.grey2,
      //width: '30%',
      // height: 50,
      backgroundColor: 'transparent',
      borderRadius: 5,
      marginHorizontal: 10,
      marginBottom: 10,
      alignItems: 'center',
      fontFamily: 'Vazirmatn',
      textAlign: RTL ? 'left' : 'right',
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
