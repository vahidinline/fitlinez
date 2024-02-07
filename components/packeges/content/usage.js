import React, { useContext } from 'react';
import { View } from 'react-native';
import { Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';

function Usage({ users }) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View>
      <View style={{ flexDirection: 'row', top: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>
          {i18n.t('download')}: {users} {i18n.t('users')}
        </Text>
      </View>
    </View>
  );
}

export default Usage;
