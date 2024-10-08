import api from './api';

const sendChatBotMessage = (
  message,
  userId,
  exerciseId,
  title,
  userLanguage
) => {
  const messages = {
    userId: userId,
    exerciseId: exerciseId,
    title: title,
    userLanguage: userLanguage,
    messages: [
      {
        role: 'user',
        content: message,
      },
      //   {
      //     role: 'system',
      //     content:
      //       'interduce yourself as Fitlinez AI agent and help people for nutrition and workout questions',
      //   },
    ],
  };
  try {
    return api.post('/fitlinez-chat-bot', messages);
    // api.post('/fitlinez-chat-bot', messages).catch((error) => {
    //   console.error('API Error:', error);
    //   if (error.response) {
    //     console.log('Response data:', error.response.data);
    //     console.log('Response status:', error.response.status);
    //     console.log('Response headers:', error.response.headers);
    //   }
    // });
  } catch (e) {
    //console.log('ddd');
  }
};

//get user usage

const getUserUsage = (userId) => {
  return api.get(`/fitlinez-chat-bot/usage/${userId}`);
};

const setAiResponseRate = (id, userRate) => {
  try {
    return api.put(`/fitlinez-chat-bot/rate/${id}`, { userRate });
  } catch (e) {
    // console.log(e);
  }
};

export { sendChatBotMessage, getUserUsage, setAiResponseRate };
