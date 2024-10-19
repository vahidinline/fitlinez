import React, { useContext } from 'react';
import { Dimensions, TouchableOpacity, View, Text } from 'react-native';
import { sendChatBotMessage, getUserUsage } from '../../api/chatBotApi';
import AuthContext from '../../api/context';
import { useTheme } from '@rneui/themed';
import { useState } from 'react';
import { useEffect } from 'react';

import ChatResponse from './response';

import { IconQuestion } from '../marketplace/filters/icons';
import ErrorIndex from './error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Button } from 'react-native-paper';

function AiAskHelpIndex({ title, i18n, userLanguage, exerciseId, userLevel }) {
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
    if (userLevel !== 4) {
      alert(i18n.t('PremiumAlert'));
      return;
    }

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
          <TouchableOpacity
            style={{
              justifyContent: 'center',

              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              borderWidth: 0.3,
              borderRadius: 10,
              marginTop: 10,
              paddingHorizontal: 10,
              marginHorizontal: 15,
              height: '100%',

              width: Dimensions.get('window').width / 1.2,
            }}
            onPress={() => sendMessage()}>
            {/* <IconQuestion
              name="robot"
              size={32}
              color={theme.colors.secondary}
              fill={theme.colors.white}
            /> */}
            <Text
              style={{
                color: theme.colors.secondary,
                textAlign: 'center',
                fontSize: 14,
                flex: 1,
                flexWrap: 'wrap',

                fontFamily: 'Vazirmatn',
                // fontWeight: 'bold',
                marginLeft: 10,
              }}
              onPress={() => sendMessage()}>
              {i18n.t('AskHelp', { exercise: title })}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default AiAskHelpIndex;
