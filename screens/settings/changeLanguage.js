import React from 'react';
import { Dimensions, FlatList, SafeAreaView, View } from 'react-native';
import { useState } from 'react';
import { Text, ThemeContext, useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import { I18n } from 'i18n-js';
import { List } from 'react-native-paper';
import AuthContext from '../../api/context';
import i18nt from '../../locales';
import Header from '../../components/header';
import RadioButtonfitlinez from '../../components/RadioButtonFitlinez';

function ChangeLanguage() {
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

  const langs = [
    {
      id: 1,
      name: 'English',
      icon: '🇺🇸',
      value: 'en',
    },
    {
      id: 2,
      name: 'Persian',
      icon: '🇮🇷',
      value: 'fa',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Header title={i18n.t('changeLanguage')} />

      <View
        style={{
          flexDirection: 'column',
          marginTop: 50,
          marginBottom: 0,
          borderRadius: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: Dimensions.get('window').width,
            marginBottom: 0,
            borderRadius: 10,
          }}>
          <FlatList
            data={langs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={() => {
                  return (
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: item.id !== 5 ? '300' : '500',
                        color: item.id !== 5 ? theme.colors.text : 'red',
                        marginLeft: 10,
                      }}>
                      {item.name}
                    </Text>
                  );
                }}
                right={(props) => (
                  <RadioButtonfitlinez
                    selected={userLanguage === item.value}
                    label={item.name}
                    onSelect={() => setUserLanguage(item.value)}
                  />
                )}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ChangeLanguage;
