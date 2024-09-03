import React, { useState } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Header from '../../components/header';
import { Button, Text, useTheme } from '@rneui/themed';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import AuthContext from '../../api/context';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import convertToPersianNumbers from '../../api/PersianNumber';

function Aboutme() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userAuth } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);
  console.log(userData);
  const navigation = useNavigation();
  //console.log('userData', userData);

  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem('userBasicData');
      if (value !== null) {
        setUserData(JSON.parse(value));

        // value previously stored
      } else {
        console.log('no data');
      }
    } catch (e) {
      // error reading value
    }
  };
  const [bio, setBio] = useState('');
  const RTL = userLanguage === 'fa';

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData && userData.length > 0) {
      const gender = userData[0]?.gender || 'person';
      const age = userData[1]?.age || '';
      const height = userData[2]?.height || '';
      const weight = userData[3]?.weight || '';
      const goalWeight = `${convertToPersianNumbers(
        userData[4]?.goalWeight || '',
        RTL
      )} ${i18n.t(userData[4]?.unit || '')}`.trim();
      const activityLevel = userData[8]?.activityLevel || '';
      const goal = userData[5]?.mainGoal || '';
      const fitnessLevel = userData[7]?.fitnessLevel || '';
      const activityLevelValue = userData[8]?.value || 1; // Ensure this has a fallback value
      const daysPerWeek = convertToPersianNumbers(
        userData[9]?.dayPreferences || '',
        RTL
      );
      const location = userData[6]?.location || '';

      const phraseEn = `You are a ${age} year old ${gender} with a height of ${height} and a weight of ${weight} and activity level of ${activityLevel}, who wants to ${goal}. To reach  ${goalWeight} you can train ${daysPerWeek} days a week, your fitness level is ${fitnessLevel}, and you prefer to train at ${location}.`;
      const phraseFa = `شما یک ${gender}  ${convertToPersianNumbers(
        age,
        RTL
      )} ساله با قد ${convertToPersianNumbers(height, RTL)} ${i18n.t(
        'cm'
      )} و وزن ${convertToPersianNumbers(weight, RTL)} ${i18n.t(
        'kg'
      )} و با  ${activityLevel} که بدنبال ${goal} هستید. برای رسیدن به وزن ${goalWeight} می‌توانید ${daysPerWeek} در هفته تمرین کنید، سطح آمادگی جسمانی شما ${fitnessLevel} است و ترجیح می‌دهید در ${location} تمرین کنید.`;

      setBio(RTL ? phraseFa : phraseEn);
    } else {
      console.log('Data is not available or empty');
    }
  }, [userData]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Dimensions.get('window').height / 15,
      }}>
      <Header title={i18n.t('aboutme')} />
      <View style={styles.fullBox}>
        <Text
          style={{
            fontFamily: 'Vazirmatn',
            textAlign: RTL ? 'right' : 'left',
            color: theme.colors.secondary,
            fontSize: 12,
          }}>
          {bio}
        </Text>
      </View>

      <Button
        buttonStyle={{
          marginTop: 20,
          borderRadius: 8,
          backgroundColor: theme.colors.button,
          width: Dimensions.get('window').width - 40,
          marginHorizontal: 20,
        }}
        onPress={() => navigation.navigate('IndexOnBoarding')}
        title={i18n.t('updateProfile')}
        titleStyle={{
          fontFamily: 'Vazirmatn',
        }}
      />
    </View>
  );
}
const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: Dimensions.get('window').height / 15,
    },
    title: {
      fontSize: 14,
      fontWeight: '400',
      //marginHorizontal: 20,
      marginTop: 0,
      color: theme.colors.grey0,
      fontFamily: 'Vazirmatn',
    },
    unit: {
      fontSize: 12,
      fontWeight: '400',
      marginHorizontal: 5,
      top: 15,
      color: theme.colors.secondary,
      fontFamily: 'Vazirmatn',
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
      //marginHorizontal: 20,
      marginTop: 10,
      color: theme.colors.secondary,
      fontFamily: 'Vazirmatn',
    },
    fullBox: {
      //flex: 1,
      backgroundColor: theme.colors.background,
      //alignItems: 'ceer',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      height: Dimensions.get('window').height / 7,
      alignContent: 'center',
      justifyContent: 'center',
    },
    halfBox: {
      //flex: 1,
      backgroundColor: theme.colors.background,
      //alignItems: 'ceer',
      marginLeft: 20,
      // marginLeft: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      height: Dimensions.get('window').height / 7,
      width: Dimensions.get('window').width / 2 - 30,
      alignContent: 'center',
      justifyContent: 'center',
    },
  });

export default Aboutme;
