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
  } catch (e) {
    console.log('ddd');
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
    console.log(e);
  }
};

export { sendChatBotMessage, getUserUsage, setAiResponseRate };
