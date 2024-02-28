import { SpeedDial, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { I18n } from 'i18n-js';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { useContext } from 'react';

function Share() {
  const [open, setOpen] = useState(false);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const [opacity, setOpacity] = useState(1);
  return (
    <SpeedDial
      style={{ color: theme.colors.primary, opacity: 0.5 }}
      isOpen={open}
      icon={{ name: 'home', color: '#fff' }}
      openIcon={{ name: 'close', color: '#fff' }}
      onOpen={() => setOpen(!open)}
      onClose={() => setOpen(!open)}>
      <SpeedDial.Action
        icon={{ name: 'share', color: '#fff' }}
        title={i18n.t('share')}
        onPress={() => console.log('Add Something')}
      />
      <SpeedDial.Action
        icon={{ name: 'photo', color: '#fff' }}
        title={i18n.t('selectPhoto')}
        onPress={() => console.log('Delete Something')}
      />
    </SpeedDial>
  );
}

export default Share;
