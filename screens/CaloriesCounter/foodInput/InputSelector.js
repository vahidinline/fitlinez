import React, { useContext, useState } from 'react';
import FoodTextInput from './FoodTextInput';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import VoiceGetter from './VoiceGetter';
import { Badge, Button } from '@rneui/base';
import {
  IconBarCode,
  IconMic,
  IconType,
} from '../../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';
import BarcodeScanner from './barcode/BarcodeScanner';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import Header from '../../../components/header';

function InputSelector({ route }) {
  const { mealValue, mealName } = route.params;
  const { theme } = useTheme();
  const [inputStatus, setInputStatus] = useState('textInput');
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  const [status, setStatus] = useState('idle');
  const [foodItems, setFoodItems] = useState([]);
  i18n.locale = userLanguage;
  const [userInput, setUserInput] = useState('');
  const handleSetStatus = (status) => {
    //setStatus('mealInitialized');
    setInputStatus(status);
  };

  const inputType = [
    {
      id: 1,
      name: 'Voice',
      func: () => handleSetStatus('voiceInput'),
      icon: <IconMic size={40} color={theme.colors.grey} />,
      active: true,
    },
    {
      id: 2,
      name: 'Text',
      func: () => handleSetStatus('textInput'),
      icon: <IconType size={40} color={theme.colors.secondary} />,
      active: true,
    },
    {
      id: 3,
      name: 'Barcode',
      func: () => handleSetStatus('barcodeInput'),
      icon: <IconBarCode size={40} color={theme.colors.grey} />,
      active: true,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title={i18n.t('foodinserttypetitle', { mealType: mealName })}
        color={theme.colors.primary}
      />
      <ScrollView>
        <View
          style={{
            padding: 20,
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {inputType.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={{
                  width: Dimensions.get('window').width / 6,
                  height: Dimensions.get('window').width / 6,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 10,
                }}
                onPress={() => (item.active ? item.func() : null)}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {!item.active && (
                    <Badge status="warning" value={'Inactive'} />
                  )}
                </View>
                {item.icon}
              </TouchableOpacity>
            ))}
          </View>
          <FoodTextInput
            selectedMeal={mealValue}
            setFoodItems={setFoodItems}
            foodItems={foodItems}
            userInput={userInput}
            setUserInput={setUserInput}
            setStatus={setStatus}
            status={status}
          />

          {inputStatus === 'voiceInput' && (
            <VoiceGetter
              setInputStatus={setInputStatus}
              setFoodItems={setFoodItems}
              setStatus={setStatus}
              userInput={userInput}
              setUserInput={setUserInput}
              selectedMeal={mealValue}
            />
          )}
          {inputStatus === 'barcodeInput' && (
            <BarcodeScanner
              selectedMeal={mealValue}
              setFoodItems={setFoodItems}
              setStatus={setStatus}
              status={status}
              userInput={userInput}
              setUserInput={setUserInput}
              foodItems={foodItems}
            />
          )}
        </View>
      </ScrollView>

      {/* {status !== 'idle' && (
        <View style={{ flex: 1 }}>
          <Button
            buttonStyle={{
              backgroundColor: theme.colors.secondary,

              borderColor: theme.colors.primary,
              borderWidth: 0.2,
              margin: 10,
              borderRadius: 10,
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontSize: 15,
              fontFamily: 'Vazirmatn',
            }}
            title={i18n.t('back')}
            onPress={() => setStatus('idle')}
          />
        </View>
      )} */}
    </SafeAreaView>
  );
}

export default InputSelector;
