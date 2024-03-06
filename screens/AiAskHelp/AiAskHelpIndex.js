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
import { IconAi } from '../marketplace/filters/icons';
import ErrorIndex from './error';

function AiAskHelpIndex({ title, category, userLanguage }) {
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const { theme } = useTheme();
  let message = `Please help me to perform ${title} exercise in ${category} category. your response should be in ${userLanguage} language. I am 41 years old man with feeling pain in my shoulder and doing workout for build muscle. I am 78 kg and 183 cm tall`;
  const [response, setResponse] = useState(''); // , response, setResponse
  const [status, setStatus] = useState('notstarted'); // , status, setStatus
  const [usage, setUsage] = useState(null); // , usage, setUsage
  const [usagePercentage, setUsagePercentage] = useState(0); // , usagePercentage, setUsagePercentage
  const [userLimitExceeded, setUserLimitExceeded] = useState(false); // , userLimitExceeded, setUserLimitExceeded
  const [responseId, setResponseId] = useState(null); // , responseId, setResponseId
  const sendMessage = () => {
    setStatus('loading');
    sendChatBotMessage(message, userId)
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

  const fetchUsage = () => {
    getUserUsage(userId).then((response) => {
      console.log(response.data);
      setUsage(response.data.dailyUsage);
      setUsagePercentage(response.data.usagePercentage);
      setUserLimitExceeded(response.data.userLimitExceeded);
    });
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  return (
    <View
      style={
        {
          //flex: 1,
          // height: Dimensions.get('window').height / 5,
          // paddingBottom: 50,
        }
      }>
      <View>
        {status === 'loading' && <Loading />}
        {status === 'done' && (
          <ChatResponse
            responseId={responseId}
            response={response}
            theme={theme}
            setStatus={setStatus}
          />
        )}
        {status === 'error' && <ErrorIndex response={response} theme={theme} />}
        {/* {status === 'notstarted' && (
          <Usage
            usage={usage}
            usagePercentage={usagePercentage}
            userLimitExceeded={true}
          />
           
        )} */}
        {status === 'notstarted' && (
          <TouchableOpacity onPress={() => sendMessage()}>
            <IconAi name="robot" size={24} color={theme.colors.secondary} />
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
