import { useContext } from 'react';
import LanguageContext from './langcontext';
import i18nt from '../locales';
import { I18n } from 'i18n-js';

const generateText = () => {
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  const texts = [
    i18n.t('text1001'),
    i18n.t('text1002'),
    i18n.t('text1003'),
    i18n.t('text501'),
    i18n.t('text502'),
    i18n.t('text503'),
    i18n.t('text701'),
    i18n.t('text702'),
    i18n.t('text703'),
    i18n.t('text901'),
    i18n.t('text902'),
    i18n.t('text903'),
  ];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
};

export default generateText;
