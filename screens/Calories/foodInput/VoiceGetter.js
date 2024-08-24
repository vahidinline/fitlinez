import React, { useState } from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { IconMic } from '../../marketplace/filters/icons';
import { Audio } from 'expo-av';
import { Iconclose } from '../../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';

const VoiceGetter = ({
  setInputStatus,
  setFoodItems,

  userInput,
}) => {
  const [recording, setRecording] = useState();
  const { theme } = useTheme();
  const [status, setStatus] = useState('recorded');
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      console.log('Recording prepared successfully');
      await recording.startAsync();
      console.log('Recording started successfully');
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    sendRecordingToServer(uri);
  };
  const sendRecordingToServer = async (uri) => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/x-wav', // Make sure this matches the file type
      name: 'voice-recording.wav',
    });

    try {
      const response = await fetch(
        'http://10.10.177.210:8090/voice/api/upload',
        {
          method: 'POST',
          body: formData, // headers are automatically set for FormData
        }
      );
      const data = await response.json();
      console.log(data);
      // Handle the response data, e.g., display the transcription
    } catch (error) {
      console.error('Error uploading recording:', error);
    }
  };

  return (
    <View
      style={{
        height: Dimensions.get('window').height / 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
      }}>
      {status === 'recorded' && (
        <View>
          <Text>
            2 smallboils eggs, 40 grams of whole grain bread, 1 small cup of
            coffee latte with sugar{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setInputStatus('idle');
              setFoodItems([
                {
                  name: 'Pizza',
                  calories: 285,
                  quantity: 2,
                },
                {
                  name: 'Coke',
                  calories: 140,
                  quantity: 1,
                },
                {
                  name: 'Ice Cream',
                  calories: 137,
                  quantity: 1,
                },
              ]);
            }}
            style={{
              backgroundColor: theme.colors.secondary,
              padding: 10,
              borderRadius: 5,
              marginTop: 10,
            }}>
            <Text
              style={{
                color: 'white',

                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}>
              Add to Meal
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {status === 'idle' && (
        <>
          <Pressable
            onPress={() => setStatus('recording')}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              margin: 0,
              padding: 4,
              zIndex: 1000,
            }}>
            <Iconclose size={30} color={theme.colors.grey2} />
          </Pressable>
          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              width: Dimensions.get('window').width / 2.7,
              height: Dimensions.get('window').height / 2,
              marginHorizontal: 20,
              alignItems: 'center',
              borderRadius: Dimensions.get('window').height / 6,
              borderWidth: 10,
              borderColor: '#5B5891',
            }}>
            <IconMic size={60} color={'#000'} />
            <Text>Hold</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default VoiceGetter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
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
  },
  verticallySpaced: {
    marginVertical: 10,
    borderWidth: 0.3,
    marginHorizontal: 10,
    height: 40,
    borderRadius: 5,
    padding: 10,
    width: '95%',
  },
  mt20: {
    marginTop: 20,
  },
});
