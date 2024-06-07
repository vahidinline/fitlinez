import React, { useState } from 'react';
import FoodTextInput from './FoodTextInput';
import {
  Dimensions,
  Pressable,
  Text,
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

function InputSelector({
  setFoodItems,
  setStatus,
  userInput,
  setUserInput,
  i18n,
}) {
  const { theme } = useTheme();
  const [inputStatus, setInputStatus] = useState('idle');

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
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {inputType.map((item) => (
            <TouchableOpacity
              style={{
                width: Dimensions.get('window').width / 3,
                height: Dimensions.get('window').width / 3,
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
        />
      )}
      {inputStatus === 'textInput' && (
        <FoodTextInput
          setInputStatus={setInputStatus}
          setFoodItems={setFoodItems}
          setStatus={setStatus}
          userInput={userInput}
          setUserInput={setUserInput}
          i18n={i18n}
        />
      )}
    </View>
  );
}

export default InputSelector;
