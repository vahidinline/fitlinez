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

function Aboutme() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userAuth } = useContext(AuthContext);
  const [userData, setUserData] = useState([]);
  const [gender, setGender] = useState(userData[0] || 'Not provided');
  const [age, setAge] = useState(userData[1] || 'Not provided');
  const [height, setHeight] = useState(userData[2] || 'Not provided');
  const [weight, setWeight] = useState(userData[3] || 'Not provided');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('cm');
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

  useEffect(() => {
    getUserData();
    setGender(userData[0]?.gender || 'Not provided');
    setAge(userData[1]?.age || 'Not provided');
    setHeight(userData[2]?.height || 'Not provided');
    setWeight(userData[3]?.weight || 'Not provided');
    setWeightUnit(userData[3]?.unit || 'kg');
    setHeightUnit(userData[2]?.unit || 'cm');
  }, [userData]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Dimensions.get('window').height / 15,
      }}>
      <Header title="About me" />
      <View style={styles.fullBox}>
        <Text style={styles.title}>{i18n.t('name')}</Text>
        <Text style={styles.value}>{userAuth?.name}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
        }}>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('gender')}</Text>
          <Text style={styles.value}>{gender}</Text>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('age')}</Text>
          <Text style={styles.value}>{age}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
        }}>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('height')}</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.value}>{height}</Text>
            <Text style={styles.unit}>{heightUnit}</Text>
          </View>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('weight')}</Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Text style={styles.value}>{weight}</Text>
            <Text style={styles.unit}>{weightUnit}</Text>
          </View>
        </View>
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
        title={'edit'}
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
    },
    unit: {
      fontSize: 12,
      fontWeight: '400',
      marginHorizontal: 5,
      top: 15,
      color: theme.colors.secondary,
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
      //marginHorizontal: 20,
      marginTop: 10,
      color: theme.colors.secondary,
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
