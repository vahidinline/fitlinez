import React, { useContext } from 'react';
import { View } from 'react-native';
import { Icon } from '@rneui/themed';
import { Icon, Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';

function Location({ location }) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        <Icon icon="home" color="#f1c40f" size={25} />
        <View
          style={{
            height: 50,
          }}>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('location')}</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {location?.map((item, index) => {
              return <Text key={index}>{item}</Text>;
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

export default Location;
