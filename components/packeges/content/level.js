import React, { useContext } from 'react';
import { View } from 'react-native';
import { Icon, Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';

function Level({ level }) {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View>
      <View style={{ flexDirection: 'row' }}>
        {/* <Icon
          icon={
            level === 'beginner'
              ? 'signal-cellular-1'
              : level === 'intermediate'
              ? 'signal-cellular-2'
              : 'signal-cellular-3'
          }
          color="#f1c40f"
          size={15}
          onPress={() => console.log('Pressed')}
        /> */}
        <View
          style={{
            height: 50,
          }}>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('level')} </Text>
          <Text> {level}</Text>
        </View>
      </View>
    </View>
  );
}

export default Level;
