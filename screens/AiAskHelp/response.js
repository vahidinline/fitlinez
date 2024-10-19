import { Text } from '@rneui/themed';
import React from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  IconAi,
  IconDislike,
  IconLike,
  IconLoading,
  IconMinimize,
  Iconclose,
} from '../marketplace/filters/icons';
import { useState } from 'react';
import { setAiResponseRate } from '../../api/chatBotApi';

function ChatResponse({
  response,
  isRTL,
  theme,
  setStatus,
  responseId,
  isRTl,
  i18n,
}) {
  const [isHide, setIsHide] = useState(false);
  const [hideFeedback, setHideFeedback] = useState(false);

  const setUserRateAi = (rate) => {
    //console.log('rate', rate, 'responseId', responseId);
    setAiResponseRate(responseId, rate);
    setHideFeedback(!hideFeedback);
  };

  return (
    <View
      style={{
        // padding: 10,
        marginBottom: 0,
        zIndex: 10,
        backgroundColor: theme.colors.primary,
        opacity: isHide ? 0.5 : 1,
        borderRadius: 12,
        direction: isRTl ? 'rtl' : 'ltr',
        width: Dimensions.get('window').width / 1.1,
        marginHorizontal: 0,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          //justifyContent: 'center',
          backgroundColor: theme.colors.secondary,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            //justifyContent: 'center',
            marginTop: 0,
          }}>
          <IconAi name="robot" size={24} color={theme.colors.background} />

          <Text
            style={{
              fontSize: 12,
              fontWeight: '500',
              color: theme.colors.background,
              textAlign: 'center',
              marginHorizontal: 10,
              fontFamily: 'Vazirmatn',
              //textAlign: !isRTL ? 'right' : 'left',
            }}>
            {i18n.t('aiResponse')}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            //justifyContent: 'center',
            fontFamily: 'Vazirmatn',
            marginTop: 0,
          }}>
          <TouchableOpacity onPress={() => setIsHide(!isHide)}>
            <IconMinimize
              name="close"
              size={24}
              color={theme.colors.background}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStatus('notstarted')}>
            <Iconclose name="close" size={24} color={theme.colors.background} />
          </TouchableOpacity>
        </View>
      </View>
      {!isHide && (
        <ScrollView
          style={{
            //justifyContent: 'center',
            // paddingBottom: 50,
            // alignItems: 'center',
            backgroundColor: theme.colors.primary,
            padding: 10,
            // height: Dimensions.get('window').height / 3,
            // width: Dimensions.get('window').width / 1.2,
            // textAlign: !isRTL ? 'right' : 'left',
            height: Dimensions.get('window').height / 6.5,
          }}>
          <Text
            style={{
              marginTop: 30,
              fontSize: 12,
              fontWeight: '400',
              color: theme.colors.text,
              textAlign: isRTL ? 'right' : 'left',
              fontFamily: 'Vazirmatn',
              paddingHorizontal: 10,
            }}>
            {response}
          </Text>
        </ScrollView>
      )}
      {!hideFeedback && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 2,
          }}>
          <Text
            style={{
              fontSize: 12,
              //fontWeight: '500',
              color: theme.colors.secondary,
              textAlign: 'center',
              marginHorizontal: 10,
              fontFamily: 'Vazirmatn',
              //textAlign: !isRTL ? 'right' : 'left',
            }}>
            {i18n.t('aiResponseRate')}
          </Text>
          <TouchableOpacity onPress={() => setUserRateAi(true)}>
            <IconLike size={24} color={theme.colors.secondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setUserRateAi(false)}>
            <IconDislike size={24} color={theme.colors.secondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default ChatResponse;
