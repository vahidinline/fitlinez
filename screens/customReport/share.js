import { useContext, useRef, useState } from 'react';
import * as Sharing from 'expo-sharing';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import { Text, useTheme } from '@rneui/themed';
import { Divider } from 'react-native-paper';
import Logo from '../../assets/logo.png';
import {
  IconArrowLeft,
  IconFire,
  IconImage,
  IconLogo,
  Iconshare,
  IxonArrow3,
} from '../marketplace/filters/icons';
import { TouchableOpacity } from 'react-native';
import convertToPersianNumbers from '../../api/PersianNumber';
import moment from 'moment';

const ShareWorkoutSession = ({ item, setShareStatus }) => {
  const [open, setOpen] = useState(false);
  const [screenShot, setScreenShot] = useState(true);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [cardPosition, setCardPosition] = useState(true);
  if (status === null) {
    requestPermission();
  }
  const imageRef = useRef();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyle(theme);
  const [image, setImage] = useState(null);
  const RTL = userLanguage === 'fa';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true, // Set this option to receive the image in base64 format
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.base64); // Save the base64 encoded image in the state
    }
  };

  const onSaveImageAsync = async () => {
    if (screenShot) {
      try {
        const localUri = await captureRef(imageRef, {
          format: 'png',
          paddingHorizontal: 10,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);

        if (localUri) {
          if (!(await Sharing.isAvailableAsync())) {
            alert("Sharing isn't available on your platform");
            return;
          }
          await Sharing.shareAsync(localUri);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const takePhoto = async () => {
    setOpen(false);

    setTimeout(async () => {
      try {
        await onSaveImageAsync();
        handleStoreandNavigate();
      } catch (error) {
        alert('Error capturing screenshot:');
      }
    }, 1000); // 1000 milliseconds = 1 second
  };

  return (
    <View
      style={{
        height: Dimensions.get('window').height,
        // paddingTop: 50,
        backgroundColor: theme.colors.background,
        paddingBottom: 0,
        borderRadius: 16,
      }}
      collapsable={false}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center',
          marginVertical: 10,
        }}
        onPress={() => {
          setShareStatus('idle');
        }}>
        <IconArrowLeft color={theme.colors.secondary} />
        <Text
          style={{
            fontFamily: 'Vazirmatn',
            fontSize: 18,
            color: theme.colors.secondary,
          }}>
          {i18n.t('back')}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          borderRadius: 16,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height / 1.9,
          //borderWidth: 1,
          borderColor: theme.colors.border,
          //marginHorizontal: 20,
          marginTop: 0,
          marginBottom: 10,
        }}>
        <ImageBackground
          ref={imageRef}
          source={
            image
              ? { uri: `data:image/gif;base64,${image}` }
              : require('../../assets/img/shareImage.jpeg')
          }
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height / 1.9,
          }}>
          <View
            style={[
              styles.topCard,
              cardPosition
                ? { top: 0 }
                : { top: Dimensions.get('window').height / 3 },
            ]}>
            <View
              style={{
                flexDirection: 'column',
                //justifyContent: 'space-between',
                width: Dimensions.get('window').width / 1.1,
                // marginTop: 15,
                height: 120,
                borderRadius: 16,
              }}>
              <View style={styles.view}>
                {/* <Text style={styles.title}>من با اپلیکیشن فیتلایز</Text>
                <Text style={styles.title}> تمرین {item.dayName} و</Text>
                <Text style={styles.title}>
                  تو{' '}
                  {convertToPersianNumbers(
                    moment(item.sessionEndDate).diff(
                      moment(item.sessionStartDate),
                      'minutes'
                    ),
                    RTL
                  )}{' '}
                  دقیقه{' '}
                </Text>
                <Text style={styles.title}>
                  {convertToPersianNumbers(item.burnedCalories.toFixed(0), RTL)}{' '}
                  کالری سوزوندم!
                  <IconFire size={32} />
                </Text> */}
                <Text style={styles.title}>
                  {i18n.t('shareResultText', {
                    dayName: `"${item.dayName}"`,
                    brand: `${i18n.t('brand')}`,
                    calories: convertToPersianNumbers(
                      item.burnedCalories.toFixed(0),
                      RTL
                    ),
                    minutes: convertToPersianNumbers(
                      moment(item.sessionEndDate).diff(
                        moment(item.sessionStartDate),
                        'minutes'
                      ),
                      RTL
                    ),
                  })}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        {/* </View> */}

        <View
          style={[
            styles.shareview,
            {
              direction: RTL ? 'rtl' : 'ltr',
            },
          ]}>
          <TouchableOpacity
            style={styles.buttonCard}
            onPress={() => {
              pickImage();
            }}>
            <IconImage />
            <Text style={styles.subtitle}>{i18n.t('selectPhoto')}</Text>
          </TouchableOpacity>
          <Divider style={styles.buttondivider} />
          <TouchableOpacity
            style={styles.buttonCard}
            onPress={() => {
              setCardPosition(!cardPosition);
            }}>
            <IxonArrow3 />
            <Text style={styles.subtitle}> {i18n.t('updown')}</Text>
          </TouchableOpacity>
          <Divider style={styles.buttondivider} />
          <TouchableOpacity
            style={styles.buttonCard}
            onPress={() => {
              onSaveImageAsync();
            }}>
            <Iconshare />
            <Text style={styles.subtitle}>{i18n.t('share')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyle = (theme, cardPosition) =>
  StyleSheet.create({
    buttonContainer: {
      //position: 'absolute',
      justifyContent: 'space-around',
      marginTop: 20,
    },
    weight: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
    },
    divider: {
      height: 10,
      width: 1,
      //  marginVertical: 10,
      backgroundColor: theme.colors.text,
    },
    buttondivider: {
      height: 70,
      width: 1,
      marginVertical: 10,
      backgroundColor: theme.colors.border,
    },
    view: {
      height: 150,
      borderEndWidth: 1,
      width: Dimensions.get('window').width / 1 - 30,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 16,
      opacity: 0.8,
      padding: 5,
      marginHorizontal: 10,
      //marginVertical: 10,
    },
    shareview: {
      //  height: 70,
      flexDirection: 'row',

      //borderEndWidth: 1,
      width: Dimensions.get('window').width / 1.1,
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 5,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginVertical: 10,
      borderRadius: 16,

      marginHorizontal: 20,
      //marginVertical: 10,
    },
    buttonCard: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Dimensions.get('window').width / 3.5,
    },

    subtitle: {
      fontSize: 10,
      fontWeight: '400',
      color: theme.colors.grey1,
      textAlign: 'center',
      marginTop: 15,
      marginHorizontal: 5,
      fontFamily: 'Vazirmatn',
    },
    category: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      marginTop: 20,
    },
    loadingText: {
      fontSize: 15,
      //fontWeight: 'bold',
      color: '#3F3B6C',
      textAlign: 'center',
      marginTop: 20,
    },
    title: {
      fontSize: 24,
      //fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'center',
      direction: 'rtl',
      //  marginTop: 20,
      fontFamily: 'Vazirmatn',
      //flexWrap: 'wrap',
      // width: Dimensions.get('window').width / 2,
      //flexShrink: 1,
    },
    topCard: {
      position: 'absolute',
      top: 0,
      left: 0,
      flexDirection: 'column',
      borderRadius: 16,
      width: '95%',
      marginHorizontal: 10,
      //  backgroundColor: '#D4D4D480',
      //marginRight: 25,
      height: '60%',
      marginVertical: 10,
      borderColor: theme.colors.border,
      //borderWidth: 1,
    },
  });

export default ShareWorkoutSession;
