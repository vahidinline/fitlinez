import { View } from 'react-native';
import { Icon } from '@rneui/themed';
import { Text } from '@rneui/themed';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { useContext } from 'react';

const BottomSection = (props) => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { newRecord } = props;
  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: 20,

        flexWrap: 'wrap',
      }}>
      {newRecord && (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F2F2F2',
          }}>
          <Text
            style={{
              color: '#3F3B6C',
              top: 5,
              fontSize: 15,
              //padding: 10,
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
            }}>
            {newRecord?.length} {i18n.t('newRecord')}
          </Text>
          <Icon name="medal" type="material-community" color="gold" size={30} />
        </View>
      )}
    </View>
  );
};

export default BottomSection;
