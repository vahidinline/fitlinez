import React, { useState } from 'react';
import FoodTextInput from './FoodTextInput';
import { Pressable, Text, View } from 'react-native';
import VoiceGetter from './VoiceGetter';
import { Button } from '@rneui/base';
import {
  IconBarCode,
  IconMic,
  IconType,
} from '../../marketplace/filters/icons';

function InputSelector({ setFoodItems, setStatus, userInput, setUserInput }) {
  const [inputStatus, setInputStatus] = useState('idle');

  const handleSetStatus = (status) => {
    //setStatus('mealInitialized');
    setInputStatus(status);
  };

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
          <Pressable style={{}} onPress={() => handleSetStatus('voiceInput')}>
            <IconMic size={80} color="white" />
          </Pressable>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 1,
              width: 200,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}
          />

          <Pressable style={{}} onPress={() => handleSetStatus('textInput')}>
            <IconType size={80} color="white" />
          </Pressable>
          <View
            style={{
              borderBottomColor: 'white',
              borderBottomWidth: 1,
              width: 200,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 20,
            }}
          />
          <Pressable
            buttonStyle={{}}
            onPress={() => handleSetStatus('textInput')}>
            <IconBarCode size={80} color="white" />
          </Pressable>
        </View>
      )}
      {inputStatus === 'voiceInput' && (
        <VoiceGetter
          setInputStatus={setInputStatus}
          setFoodItems={setFoodItems}
          setStatus={setStatus}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      )}
      {inputStatus === 'textInput' && (
        <FoodTextInput
          setInputStatus={setInputStatus}
          setFoodItems={setFoodItems}
          setStatus={setStatus}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      )}
    </View>
  );
}

export default InputSelector;
