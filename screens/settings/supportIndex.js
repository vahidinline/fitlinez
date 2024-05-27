import React from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
  Share,
  Linking,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import UserImagePicker from '../../components/userData/userImage';
import { useState } from 'react';
import { Icon, ListItem, Text, ThemeContext, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import { Button, List } from 'react-native-paper';
import AuthContext from '../../api/context';
import i18nt from '../../locales';
import { RadioButton } from 'react-native-paper';

import { flagUs } from '../marketplace/filters/icons-';
import Header from '../../components/header';

function SupportIndex() {
  const key = 'fitlinez-session';
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { toggleTheme } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState(null);
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title={i18n.t('support')} />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: 90,
          marginBottom: 0,
          marginHorizontal: 10,
          //backgroundColor: theme.colors.red,
          borderRadius: 24,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            // marginTop: 20,
            marginBottom: 0,
            marginLeft: 10,
            borderWidth: 0.4,
            borderRadius: 10,
            borderColor: '#5B5891',
            width: Dimensions.get('window').width / 1.1,
            height: Dimensions.get('window').height / 5,
            alignContent: 'center',
            alignItems: 'center',
            //alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              marginBottom: 20,
            }}>
            {i18n.t('supportText')}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              // marginTop: 20,
              marginBottom: 0,
              marginLeft: 10,
              //borderWidth: 1,
              borderRadius: 10,
              //borderColor: '#5B5891',
              // width: 50,
              // height: 50,
              alignContent: 'center',
              alignItems: 'center',
              //alignSelf: 'center',
              justifyContent: 'center',
            }}>
            <Text>Telegram :</Text>
            <Text
              style={{
                color: theme.colors.secondary,
                fontSize: 16,
                fontWeight: '600',
              }}>
              @Fitilinezsupport
            </Text>
          </View>
          <Button
            onPress={() => Linking.openURL('https://t.me/fitlinezsupport')}
            style={{
              backgroundColor: theme.colors.button,
              borderRadius: 10,
              width: Dimensions.get('window').width / 1.2,
              marginTop: 20,
            }}>
            <Text
              style={{
                color: theme.colors.primary,
              }}>
              {i18n.t('support')}
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default SupportIndex;
