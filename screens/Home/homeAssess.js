import { Icon, Image, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Platform } from 'react-native';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
function HomeAssess() {
  const Userplatform = Platform.OS;
  const { userLanguage } = useContext(LanguageContext);
  const [avatar, setAvatar] = useState();

  const navigation = useNavigation();
  const { theme } = useTheme();
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;

  useEffect(() => {
    //get image from async storage
    const getImage = async () => {
      try {
        await AsyncStorage.getItem('@userImage').then((value) => {
          if (value !== null) {
            setAvatar(value);
          }
        });
      } catch (e) {
        console.error('Error reading data from AsyncStorage', e);
      }
    };

    getImage();
  }, []);

  return (
    <View
      style={{
        margin: 14,
      }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('GetUserData', {
            screen: 'GetUserData',
          })
        }
        style={{
          flexDirection: 'row',
          // position: 'absolute',
          top: 0,
          right: 10,
        }}>
        {!avatar ? (
          <Icon
            name="account-circle"
            size={50}
            color={theme.colors.secondary}
          />
        ) : (
          <Image
            source={{ uri: avatar }}
            style={{ width: 50, height: 50, borderRadius: 25 }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export default HomeAssess;
