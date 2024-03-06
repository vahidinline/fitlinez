import React, { useContext } from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
import { sendChatBotMessage, getUserUsage } from '../../api/chatBotApi';
import AuthContext from '../../api/context';
import { Button, Input, Text } from '@rneui/themed';
import { useState } from 'react';
import ChatResponse from './response';
import Usage from './usage';
import Loading from './loading';
import InputChat from './inputChat';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import DefaultState from './defaultState';

function ChatBotIndex({ isRTL, theme }) {
  const { userAuth } = useContext(AuthContext);
  const navigation = useNavigation();
  const userId = userAuth.id;
  const [message, setMessage] = useState(''); // [message, setMessage
  const [response, setResponse] = useState(''); // , response, setResponse
  const [status, setStatus] = useState('notstarted'); // , status, setStatus
  const [usage, setUsage] = useState(null); // , usage, setUsage
  const [usagePercentage, setUsagePercentage] = useState(0); // , usagePercentage, setUsagePercentage
  const [userLimitExceeded, setUserLimitExceeded] = useState(false); // , userLimitExceeded, setUserLimitExceeded
  const sendMessage = () => {
    setStatus('loading');
    sendChatBotMessage(message, userId)
      .then((response) => {
        setResponse(response.data.output);
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

  //trigger in focus of the screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('ChatBotIndex focused');
      fetchUsage();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{
          height: Dimensions.get('window').height / 1.8,
        }}>
        {status === 'loading' && <Loading />}
        {status === 'done' && (
          <ChatResponse response={response} isRTL={isRTL} theme={theme} />
        )}
        {status === 'error' && <Text>Error: {response}</Text>}
        {status === 'notstarted' && (
          <DefaultState theme={theme} isRTL={isRTL} />
        )}
        {status === 'usageChecing' && (
          <Usage
            usage={usage}
            usagePercentage={usagePercentage}
            userLimitExceeded={true}
          />
        )}
      </ScrollView>
      <InputChat
        theme={theme}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </View>
  );
}

export default ChatBotIndex;
