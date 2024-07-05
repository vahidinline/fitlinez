import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useRef, useState } from 'react';
import * as Sharing from 'expo-sharing';
import {
  View,
  StyleSheet,
  Linking,
  Dimensions,
  ImageBackground,
  Pressable,
  Alert,
} from 'react-native';
import { I18n } from 'i18n-js';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { useNavigation } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import * as ImagePicker from 'expo-image-picker';
import { Button, Text, useTheme } from '@rneui/themed';
import { Divider } from 'react-native-paper';
import formatTime from '../../api/timeFormat';
import {
  IconFire,
  IconImage,
  IconLogo,
  Iconshare,
  IxonArrow3,
} from '../marketplace/filters/icons';
import Header from '../../components/header';
import { TouchableOpacity } from 'react-native';
import { getBurnedCalories } from '../../api/getBurnedCalories';
import AuthContext from '../../api/context';

const SahreResult = ({ route }) => {
  const [open, setOpen] = useState(false);
  const [screenShot, setScreenShot] = useState(true);
  const [newRecord, setNewRecord] = useState([]);
  const [status, requestPermission] = MediaLibrary.usePermissions();
  const [cardPosition, setCardPosition] = useState(true);
  if (status === null) {
    requestPermission();
  }
  const [burnedCalories, setBurnedCalories] = useState(null);
  const { userAuth } = useContext(AuthContext);
  const userId = userAuth.id;
  const imageRef = useRef();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { theme } = useTheme();
  const styles = getStyle(theme);
  const date = new Date().toISOString().substring(0, 10);
  const navigation = useNavigation();
  const [sessionNumber, setSessionNumber] = useState(1);
  const [image, setImage] = useState(null);
  const { timeSpent, totalWeightSum, category, location, performance } =
    route.params;
  const RTL = userLanguage === 'fa';
  useEffect(() => {
    const fetchData = async () => {
      AsyncStorage.getItem(date).then((data) => {
        const result = JSON.parse(data);

        setNewRecord(result);
      });
      const newData = newRecord;
      //   console.log('newData', newData);
      try {
        const existingData = await AsyncStorage.getItem('ListOfRecoreds');
        if (existingData !== null) {
          const mergedData = JSON.stringify([
            ...JSON.parse(existingData),
            ...newData,
          ]);
          await AsyncStorage.setItem('ListOfRecoreds', mergedData);
        } else {
          const newAsyncStorageData = JSON.stringify(newData);
          await AsyncStorage.setItem('ListOfRecoreds', newAsyncStorageData);
        }
      } catch (error) {
        return;
      }
    };
    fetchData();
  }, []);

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

  useEffect(() => {
    const SessionCounter = async () => {
      const today = new Date().toISOString().substring(0, 10);

      const data = await AsyncStorage.getItem('NumberofWorkOutDone');

      if (data !== null) {
        const parsedData = JSON.parse(data);

        const { count } = parsedData;
        newCount = count + 1;
        AsyncStorage.setItem(
          `NumberofWorkOutDone`,
          JSON.stringify({
            count: newCount,
          })
        ).then(() => {
          setSessionNumber(newCount);
        });
      } else {
        AsyncStorage.setItem(
          `NumberofWorkOutDone`,
          JSON.stringify({ count: 1 })
        ).then(() => {
          setSessionNumber(1);
        });
      }
    };
    SessionCounter();
  }, []);
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

  //   const dataToSave = {
  //     category: category,
  //     location: location,
  //     timeSpent: timeSpent,
  //     liftedWeight: totalWeightSum,
  //     performance: performance,
  //   };
  //   try {
  //     db.transaction((tx) => {
  //       tx.executeSql(
  //         'INSERT INTO userWorkOutSession (data) VALUES (?);',
  //         [JSON.stringify(dataToSave)],
  //         (tx, results) => {
  //           if (results.rowsAffected > 0) {
  //             console.log('Insertion successful');
  //           } else {
  //             console.log('Insertion failed');
  //           }
  //         }
  //       );
  //     });
  //     console.log('dataToSave in finish page ', dataToSave);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleShowBurnedCalories = async () => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    const burnedCalories = await getBurnedCalories(userId, sessionId);
    if (!burnedCalories) {
      Alert.alert(
        i18n.t('burnedCalories'),
        i18n.t('burnedCaloriesDescription'),
        [
          {
            text: i18n.t('update'),
            onPress: () => navigation.navigate('IndexOnBoarding'),
          },
          {
            text: i18n.t('later'),
          },
        ],
        { cancelable: true }
      );
    }
    setBurnedCalories(burnedCalories);
  };

  useEffect(() => {
    handleShowBurnedCalories();
  }, []);

  const handleStoreandNavigate = () => {
    //saveUserData();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View
      style={{
        height: Dimensions.get('window').height,
        paddingTop: 50,
        backgroundColor: theme.colors.background,
        paddingBottom: 0,
        borderRadius: 16,
      }}
      collapsable={false}>
      <Header title={i18n.t('share')} />
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
          <View style={!cardPosition ? styles.topCard : styles.bottomCard}>
            <View
              style={{
                width: Dimensions.get('window').width / 1.1 - 30,
                height: Dimensions.get('window').height / 15,
                marginLeft: 20,
                marginHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                marginTop: 20,
                zIndex: 100,
              }}>
              <IconLogo />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: Dimensions.get('window').width / 1.1,
                marginTop: 15,
                height: 100,
                borderRadius: 16,
              }}>
              {category !== 'Cardio' && (
                <>
                  <View style={styles.view}>
                    <Text style={styles.title}>
                      {totalWeightSum}
                      <Text style={styles.subtitle}> {i18n.t('kg')}</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                      {i18n.t('liftedweight')}
                    </Text>
                  </View>
                  <Divider style={styles.divider} />
                </>
              )}
              {burnedCalories && (
                <View style={styles.view}>
                  <Text style={styles.title}>
                    {burnedCalories.totalCaloriesBurned.toFixed(0)} kcal
                  </Text>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                    }}
                    //</View> onPress={() => handleShowBurnedCalories()}
                  >
                    <Text style={styles.subtitle}>
                      {i18n.t('burnedCalories')}
                    </Text>
                    <IconFire />
                  </Pressable>
                </View>
              )}
              <Divider style={styles.divider} />
              <View style={styles.view}>
                <Text style={styles.title}>{formatTime(timeSpent)}</Text>
                <Text style={styles.subtitle}>{i18n.t('duration')}</Text>
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
            <Text style={styles.subtitle}>1- {i18n.t('selectPhoto')}</Text>
          </TouchableOpacity>
          <Divider style={styles.buttondivider} />
          <TouchableOpacity
            style={styles.buttonCard}
            onPress={() => {
              setCardPosition(!cardPosition);
            }}>
            <IxonArrow3 />
            <Text style={styles.subtitle}>2- {i18n.t('updown')}</Text>
          </TouchableOpacity>
          <Divider style={styles.buttondivider} />
          <TouchableOpacity
            style={styles.buttonCard}
            onPress={() => {
              onSaveImageAsync();
            }}>
            <Iconshare />
            <Text style={styles.subtitle}>3- {i18n.t('share')}</Text>
          </TouchableOpacity>
        </View>
        <Button
          buttonStyle={{
            width: Dimensions.get('window').width / 1.1,
            height: 50,
            borderRadius: 16,
            backgroundColor: theme.colors.button,
            borderWidth: 1,
            borderColor: theme.colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
            marginHorizontal: 20,
          }}
          onPress={handleStoreandNavigate}>
          {i18n.t('home')}
        </Button>
      </View>
    </View>
  );
};

const getStyle = (theme) =>
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
      height: 70,
      width: 1,
      marginVertical: 10,
      backgroundColor: theme.colors.text,
    },
    buttondivider: {
      height: 70,
      width: 1,
      marginVertical: 10,
      backgroundColor: theme.colors.border,
    },
    view: {
      height: 70,
      //borderEndWidth: 1,
      width: Dimensions.get('window').width / 4.2,
      justifyContent: 'space-between',
      //alignItems: 'center',

      padding: 5,
      marginHorizontal: 10,
      //marginVertical: 10,
    },
    shareview: {
      height: 70,
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
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.secondary,
      textAlign: 'center',
      marginTop: 20,
    },
    topCard: {
      position: 'absolute',
      top: 0,
      left: 0,
      flexDirection: 'column',
      borderRadius: 16,
      width: '95%',
      marginHorizontal: 10,
      backgroundColor: '#D4D4D480',
      //marginRight: 25,
      marginVertical: 10,
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
    bottomCard: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      flexDirection: 'column',
      borderRadius: 16,
      width: '95%',
      marginHorizontal: 10,
      backgroundColor: '#D4D4D480',
      //marginRight: 25,
      marginVertical: 10,
      borderColor: theme.colors.border,
      borderWidth: 1,
    },
  });

export default SahreResult;
