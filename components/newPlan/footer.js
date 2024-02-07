import React, { useContext } from 'react';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { Icon } from '@rneui/themed';

function Footer(props) {
  const { progress, index, undoneItem, doneItem, data } = props;
  const { userLanguage } = useContext(LanguageContext);

  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        //flex: 0.2,
        flexDirection: 'row',
        textAlign: 'center',
        backgroundColor: '#3e3e3e',
        //bottom: 10,
        //width: Dimensions.get('window').width,

        //padding: 10,
      }}>
      <Pressable
        disabled={progress < 2}
        style={{
          // position: 'absolute',
          marginLeft: 10,
          width: '50%',
          backgroundColor: progress < 2 ? 'darkgray' : '#3f51b5',
        }}
        color="#000"
        icon="chevron-left"
        iconSize={24}
        mode="contained"
        onPress={() => undoneItem(index)}>
        <Text style={{ color: '#fff' }}>{i18n.t('previousExercise')}</Text>
      </Pressable>
      <Pressable
        disabled={progress === data.length}
        style={{
          width: '50%',
          // position: 'absolute',
          marginRight: 10,
          backgroundColor: progress === data.length ? '#eee' : '#3f51b5',
          color: '#000',
        }}
        color="#000"
        icon="chevron-right"
        iconSize={24}
        mode="contained"
        onPress={() => doneItem(index)}>
        <Text style={{ color: '#fff' }}>{i18n.t('nextExercise')}</Text>
      </Pressable>
    </View>
  );
}

export default Footer;
