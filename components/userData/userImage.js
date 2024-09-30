import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native';
import { Icon, Image, Text, useTheme } from '@rneui/themed';
import * as FileSystem from 'expo-file-system';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Path, Svg } from 'react-native-svg';
import { IconCamera } from '../../screens/marketplace/filters/icons';

export default function UserImagePicker({ setAvatar }) {
  const [image, setImage] = useState(null);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const { theme } = useTheme();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      convertImageToBase64(result.assets[0].uri);
    }
    setImageAsync(result.assets[0].uri);
  };

  const setImageAsync = async (image) => {
    //set image to async storage
    try {
      await AsyncStorage.setItem('@userImage', image);
    } catch (e) {
      console.error('Error saving data to AsyncStorage', e);
    }
  };

  useEffect(() => {
    //get image from async storage
    const getImage = async () => {
      try {
        await AsyncStorage.getItem('@userImage').then((value) => {
          if (value !== null) {
            setImage(value);
          }
        });
      } catch (e) {
        console.error('Error reading data from AsyncStorage', e);
      }
    };

    getImage();
  }, []);

  async function convertImageToBase64(image) {
    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: 'base64',
      });
      setAvatar(base64);
    } catch (error) {
      console.error('Error converting image to Base64', error);
    }
  }

  return (
    <TouchableOpacity
      onPress={pickImage}
      style={{
        // flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        borderColor: theme.colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        //borderWidth: 0.5,
        borderRadius: 20,

        //borderColor: theme.colors.border,
        width: 100,
        height: 100,
        // backgroundColor: 'white',
      }}>
      <View
        style={{
          position: 'absolute',
          top: 80,
          // right: 30,
          //left: Dimensions.get('window').width / 5.5,
          backgroundColor: theme.colors.background,
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 10,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
          //opacity: 0.5,
        }}>
        <IconCamera />
      </View>
      {image && (
        <View
          style={
            {
              //position: 'relative', // This will allow absolute positioning within
            }
          }>
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              width: 200,
              // top: 20,
              opacity: 1,
            }}>
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, borderRadius: 20 }}
            />

            <View
              style={{
                position: 'absolute',
                top: 80,
                // right: 30,
                // left: Dimensions.get('window').width / 5.5,
                backgroundColor: theme.colors.background,
                borderWidth: 0.5,
                borderColor: theme.colors.border,
                borderRadius: 10,
                width: 40,
                height: 40,
                opacity: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconCamera />
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
