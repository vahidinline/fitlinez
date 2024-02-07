import React, { useContext } from 'react';
import {
  Alert,
  Share,
  View,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { useFonts } from 'expo-font';
import LanguageContext from '../../api/langcontext';
import { Button, ButtonGroup, Icon } from '@rneui/themed';
const ShareApp = () => {
  const i18n = new I18n(i18nt);
  const { userLanguage } = useContext(LanguageContext);
  i18n.locale = userLanguage;
  const message =
    //'https://fitlinez.com/application?utm_source=fitlinezApp&utm_medium=share&utm_campaign=sharetoFriendWithInApp';
    Platform.OS === 'ios'
      ? 'https://apps.apple.com/ee/app/fitlinez/id6443489365'
      : 'https://play.google.com/store/apps/details?id=e.fitlinez.eu&hl=en&gl=EE';

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <View style={styles.section}>
      <Button
        buttonStyle={styles.Button}
        onPress={onShare}
        title={i18n.t('share')}
        icon={<Icon name="share" size={15} color="white" />}
      />
    </View>
  );
};

export default ShareApp;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  Button: {
    backgroundColor: '#3F3B6C',
    padding: 10,

    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
  },
});
