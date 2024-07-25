import React, { useState } from 'react';
import FoodTextInput from './FoodTextInput';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import VoiceGetter from './VoiceGetter';
import { Badge, Button } from '@rneui/base';
import {
  IconBarCode,
  IconMic,
  IconType,
} from '../../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';
import BarcodeScanner from './barcode/BarcodeScanner';

function InputSelector({
  setFoodItems,
  setStatus,
  userInput,
  status,
  setUserInput,
  selectedMeal,
  i18n,
  userId,
  RTL,
}) {
  const { theme } = useTheme();
  const [inputStatus, setInputStatus] = useState('idle');
  //console.log('selectedMeal in InputSelector', selectedMeal);
  const handleSetStatus = (status) => {
    //setStatus('mealInitialized');
    setInputStatus(status);
  };

  const inputType = [
    {
      id: 1,
      name: 'Voice',
      func: () => handleSetStatus('voiceInput'),
      icon: <IconMic size={80} color={theme.colors.grey} />,
      active: false,
    },
    {
      id: 2,
      name: 'Text',
      func: () => handleSetStatus('textInput'),
      icon: <IconType size={80} color={theme.colors.secondary} />,
      active: true,
    },
    {
      id: 3,
      name: 'Barcode',
      func: () => handleSetStatus('barcodeInput'),
      icon: <IconBarCode size={80} color={theme.colors.grey} />,
      active: false,
    },
  ];

  return (
    <View
      style={{
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        //backgroundColor: 'white',
      }}>
      {inputStatus === 'idle' && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {inputType.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                width: Dimensions.get('window').width / 4,
                height: Dimensions.get('window').width / 4,
                backgroundColor: 'lightgrey',
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
                {!item.active && <Badge status="warning" value={'Inactive'} />}
              </View>
              {item.icon}
            </TouchableOpacity>
          ))}
        </View>
      )}
      {inputStatus === 'voiceInput' && (
        <VoiceGetter
          setInputStatus={setInputStatus}
          setFoodItems={setFoodItems}
          setStatus={setStatus}
          userInput={userInput}
          setUserInput={setUserInput}
          i18n={i18n}
          selectedMeal={selectedMeal.value}
        />
      )}
      {inputStatus === 'textInput' && (
        <FoodTextInput
          selectedMeal={selectedMeal}
          RTL={RTL}
          setInputStatus={setInputStatus}
          setFoodItems={setFoodItems}
          setStatus={setStatus}
          userInput={userInput}
          setUserInput={setUserInput}
          i18n={i18n}
          status={status}
          userId={userId}
        />
      )}

      {inputStatus === 'barcodeInput' && (
        <BarcodeScanner
          selectedMeal={selectedMeal}
          RTL={RTL}
          setInputStatus={setInputStatus}
          setFoodItems={setFoodItems}
          setStatus={setStatus}
          userInput={userInput}
          setUserInput={setUserInput}
          i18n={i18n}
          status={status}
          userId={userId}
        />
      )}

      <View>
        <Button
          buttonStyle={{
            backgroundColor: theme.colors.secondary,

            borderColor: theme.colors.primary,
            borderWidth: 0.2,
            marginBottom: 50,
            margin: 10,
            borderRadius: 10,
          }}
          titleStyle={{
            color: theme.colors.primary,
            fontSize: 15,
            //fontWeight: 'bold',
            fontFamily: 'Vazirmatn',
          }}
          title={i18n.t('back')}
          onPress={() => setStatus('idle')}
        />
      </View>
    </View>
  );
}

export default InputSelector;
