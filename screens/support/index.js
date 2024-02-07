import React, { useContext, useEffect } from 'react';
import { Linking, SafeAreaView } from 'react-native';
import Header from '../../components/header';
import { Button, Card, Text, useTheme } from '@rneui/themed';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';

function SupportIndex() {
  useEffect(() => {}, []);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  return (
    <SafeAreaView>
      <Header title="Support" />
      <Card>
        <Text>
          {i18n.t('supportText')}
          {'\n'}
          {'\n'}
          {i18n.t('supportText2')}
        </Text>
        <Button
          buttonStyle={{
            marginTop: 20,
          }}
          color={theme.colors.secondary}
          onPress={() => Linking.openURL('https://t.me/fitlinezsupport')}
          size="lg">
          {i18n.t('support')}
        </Button>
      </Card>
    </SafeAreaView>
  );
}

export default SupportIndex;
