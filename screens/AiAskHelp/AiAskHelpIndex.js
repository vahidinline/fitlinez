import React, { useContext } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { sendChatBotMessage, getUserUsage } from '../../api/chatBotApi';
import AuthContext from '../../api/context';
import { Button, Text, useTheme } from '@rneui/themed';
import { useState } from 'react';
import { useEffect } from 'react';
import Loading from './loading';
import ChatResponse from './response';
import InputChat from './inputChat';
import Usage from './usage';
import {
  IconAi,
  IconLoading,
  IconQuestion,
} from '../marketplace/filters/icons';
import ErrorIndex from './error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import AnimatedLottieView from 'lottie-react-native';

function AiAskHelpIndex({ title, i18n, userLanguage, exerciseId }) {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { theme } = useTheme();
  const [userPain, setUserPain] = useState(null);
  let isRTl = userLanguage === 'fa' ? true : false;
  //let message = `Help me perform ${title} exercise in ${category} and suggest the weight and reps, my 1rm is 40kg. Response in ${userLanguage}. I'm a 41-year-old man, 78 kg, 183 cm tall, with ${userPain}. Doing muscle-building workout.`;
  let message = `Please provide short, lest than 1000 token in ${
    userLanguage === 'en' ? 'in english' : ' فارسی'
  }, detailed step-by-step instructions on how to perform the ${title} exercise with  ${
    userPain === null ? 'no pain' : `special attention to reducing ${userPain}`
  }`;

  const [response, setResponse] = useState(''); // , response, setResponse
  const [status, setStatus] = useState('notstarted'); // , status, setStatus
  const [usage, setUsage] = useState(null); // , usage, setUsage
  const [usagePercentage, setUsagePercentage] = useState(0); // , usagePercentage, setUsagePercentage
  const [userLimitExceeded, setUserLimitExceeded] = useState(false); // , userLimitExceeded, setUserLimitExceeded
  const [responseId, setResponseId] = useState(null); // , responseId, setResponseId
  const sendMessage = () => {
    getUserPain();
    setStatus('loading');
    sendChatBotMessage(message, userId, exerciseId, title, userLanguage)
      .then((response) => {
        setResponse(response.data.output);

        setResponseId(response.data._id);
        setStatus('done');
      })
      .catch((error) => {
        setStatus('error');
        setResponse('Error: ' + error);
      });
  };

  //console.log('message', message);
  const fetchUsage = () => {
    getUserUsage(userId).then((response) => {
      // console.log(response.data);
      setUsage(response.data.dailyUsage);
      setUsagePercentage(response.data.usagePercentage);
      setUserLimitExceeded(response.data.userLimitExceeded);
    });
  };

  useEffect(() => {
    fetchUsage();
    getUserPain();
  }, []);

  const getUserPain = async () => {
    try {
      const value = await AsyncStorage.getItem('userPain');
      //console.log('value', value);
      if (value !== null) {
        setUserPain(value);
      }
    } catch (e) {
      console.log('error', e);
    }
  };

  return (
    <View
      style={{
        //flex: 1,
        height: Dimensions.get('window').height / 15,
        // paddingBottom: 50,
      }}>
      <View>
        {status === 'loading' && (
          <ActivityIndicator size="small" color="#5B5891" />
        )}
        {status === 'done' && (
          <ChatResponse
            isRTl={isRTl}
            responseId={responseId}
            response={response}
            theme={theme}
            setStatus={setStatus}
            i18n={i18n}
          />
        )}
        {status === 'error' && (
          <ErrorIndex
            isRTl={isRTl}
            tryAgain={sendMessage}
            i18n={i18n}
            response={response}
            theme={theme}
          />
        )}
        {/* {status === 'notstarted' && (
          <Usage
            usage={usage}
            usagePercentage={usagePercentage}
            userLimitExceeded={true}
          />

        )} */}
        {status === 'notstarted' && (
          <TouchableOpacity onPress={() => sendMessage()}>
            <IconQuestion
              name="robot"
              size={32}
              color={theme.colors.secondary}
            />
          </TouchableOpacity>
        )}

        {/* <Button
          buttonStyle={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 10,
            marginHorizontal: 30,
            height: 40,
            width: Dimensions.get('window').width / 1.2,
          }}
          titleStyle={{
            color: theme.colors.secondary,
            fontWeight: '500',
            fontSize: 12,
          }}
          onPress={() => sendMessage()}>
          Help me to do it
        </Button> */}
      </View>
    </View>
  );
}

export default AiAskHelpIndex;
