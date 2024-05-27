import React, { useState } from 'react';
import FoodTextInput from './FoodTextInput';
import { Pressable, Text, View } from 'react-native';
import VoiceGetter from './VoiceGetter';
import { Button } from '@rneui/base';
import { IconMic, IconType } from '../../marketplace/filters/icons';

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
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Pressable
            buttonStyle={{}}
            onPress={() => handleSetStatus('voiceInput')}>
            <IconMic size={80} color="white" />
          </Pressable>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: 'white',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            OR
          </Text>
          <Pressable
            buttonStyle={{}}
            onPress={() => handleSetStatus('textInput')}>
            <IconType size={80} color="white" />
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
