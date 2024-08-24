import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { sendInitialReq } from '../../../api/sendFoodQuery';
import { Button } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../../../api/context';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import { IconSearch } from '../../marketplace/filters/icons';
import TempfoodItems from '../TempfoodItems';
function FoodTextInput({ selectedMeal }) {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
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
    console.log('inside handleInput text input');
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
    <SafeAreaView
      style={{
        flex: 1,
        margin: 0,
        height: Dimensions.get('window').height,
        // backgroundColor: theme.colors.warning,
      }}>
      {status === 'success' && (
        <TempfoodItems
          foodItems={foodItems}
          userId={userId}
          selectedMeal={selectedMeal}
          setStatus={setStatus}
          i18n={i18n}
        />
      )}
      <View
        style={{
          // flex: 1,
          position: 'absolute',
          //bottom: 0,
          top: Dimensions.get('window').height / 1.8,
          flexDirection: 'row',
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
            <IconSearch />
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default FoodTextInput;

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    bottom: 0,

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
    // marginVertical: 10,
    borderWidth: 0.2,
    marginHorizontal: 10,
    height: 100,

    borderRadius: 5,
    padding: 10,
    width: '80%',
    textAlignVertical: 'top',
    fontFamily: 'Vazirmatn',
  },

  saveButton: {
    //padding: 10,
    //width: '30%',
    // height: 50,
    backgroundColor: 'transparent',
    borderRadius: 5,
    // marginHorizontal: 10,
    //marginBottom: 10,
    alignItems: 'center',
    fontFamily: 'Vazirmatn',
  },
});
