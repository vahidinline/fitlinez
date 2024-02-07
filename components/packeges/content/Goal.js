import React, { useContext } from 'react';
import { View } from 'react-native';
import { Icon, Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';

function Goal({ goal }) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Icon icon="target" color="#f1c40f" size={25} />
        <View
          style={{
            height: 50,
          }}>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('target')} </Text>
          <Text>{goal} </Text>
        </View>
      </View>
    </View>
  );
}

export default Goal;
