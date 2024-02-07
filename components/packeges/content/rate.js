import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';

function Rate({ rate }) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {[...Array(5)].map((e, i) => {
          return (
            <Text
              key={i}
              style={{
                fontSize: 20,
                color: i + 1 <= rate ? '#ffcc00' : '#e0e0e0',
              }}>
              ★
            </Text>
          );
        })}
      </View>
    </View>
  );
}

export default Rate;
