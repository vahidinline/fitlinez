import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { IconMic, IconRecording } from '../../marketplace/filters/icons';
import { Audio } from 'expo-av';
import { Iconclose } from '../../marketplace/filters/icons';
import { useTheme } from '@rneui/themed';

const VoiceGetter = ({
  setInputStatus,
  setFoodItems,
  setStatus,
  userInput,
  setUserInput,
}) => {
  const [recording, setRecording] = useState();
  const [startTime, setStartTime] = useState(null);
  const { theme } = useTheme();
  const [isPermission, setIsPermission] = useState(false);
  const getPermission = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setIsPermission(true);
      // Record the start time
    } catch (err) {
      setIsPermission(false);
      console.error('Failed to start recording', err);
    }
  };
  useEffect(() => {
    getPermission();
  }, []);

  const startRecording = async () => {
    try {
      if (isPermission) {
        const recording = new Audio.Recording();
        await recording.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        console.log('Recording prepared successfully');
        await recording.startAsync();
        console.log('Recording started successfully');
        setRecording(recording);
        setStartTime(Date.now()); // Record the start time
      }
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    const duration = Date.now() - startTime;
    setRecording(undefined);

    if (duration < 1000) {
      // Ignore recordings shorter than 1 second
      console.log('Recording too short, discarded.');
      await recording.stopAndUnloadAsync();
      return;
    }

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
        'https://aibackendfitlinez.azurewebsites.net/voice/api/upload',
        {
          method: 'POST',
          body: formData, // headers are automatically set for FormData
        }
      );
      const data = await response.json();
      console.log(data);
      setUserInput(data.text);
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
        // backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        padding: 10,
      }}>
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
          borderColor: '#5B5891',
        }}>
        <IconRecording />
      </TouchableOpacity>
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
