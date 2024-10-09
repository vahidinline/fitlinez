import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { useState } from 'react';
import AuthContext from '../../api/context';
import { getUserFirstData } from '../../api/getUserBasicData';

function HasWorkoutCard({ title, location }) {
  // console.log('location in current', location);

  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [status, setStatus] = useState('idle');

  const getUserInfo = async () => {
    getUserFirstData(userAuth.id).then((data) => {
      if (!data || data?.length === 0) {
        setStatus('noData');
      } else {
        setStatus('data');
      }
    });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleNextStep = () => {
    if (userLevel === 4) {
      // condition 1
      navigation.navigate('SessionNavigator', {
        screen: 'StartSessionIndex',
        params: { title: title, location: location },
      });
    } else if (userPrivilege) {
      // condition 1
      navigation.navigate('SessionNavigator', {
        screen: 'StartSessionIndex',
        params: { title: title, location: location },
      });
    } else {
      //condition 2
      navigation.navigate('Upgrade');
    }
  };

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={['#5B5891', '#3A366F', '#17124A']}
        style={styles.background}
      />

      <View
        style={{
          paddingHorizontal: 10,
          marginTop: 5,
          borderBottomColor: 'grey',
          paddingBottom: 5,
          //borderBottomWidth: 1,
        }}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            //marginHorizontal: 20,
            alignItems: 'center',
            marginTop: 20,
            width: Dimensions.get('window').width / 1.1,
            height: Dimensions.get('window').height / 15,
            // marginHorizontal: 20,
          }}>
          {title ? (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Vazirmatn',
                marginHorizontal: 10,
                // marginTop: 5,
                color: 'white',
                //direction: 'rtl',
                textAlign: 'center',
                justifyContent: 'center',
              }}>
              {i18n.t('yourWorkoutPlan')} : {title}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Vazirmatn',
                marginHorizontal: 10,
                marginTop: 0,
                color: 'white',
                //direction: 'rtl',
                textAlign: 'right',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
              {i18n.t('title')}
            </Text>
          )}
        </View>
      </View>
      <View
        style={{
          top: 30,
        }}>
        <Button
          onPress={() => {
            handleNextStep();
          }}
          titleStyle={{
            color: theme.colors.text,
            fontSize: PixelRatio.get() < 3 ? 10 : 14,
            fontWeight: '500',
            fontFamily: 'Vazirmatn',
          }}
          buttonStyle={{
            borderRadius: 8,
            backgroundColor: theme.colors.primary,
            borderWidth: 1,
            borderColor: theme.colors.border,

            //top: 20,
            marginHorizontal: 15,
            height: 40,
            width: Dimensions.get('window').width / 1.2,
          }}>
          {i18n.t('seeLastExercises')}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    //alignItems: 'center',
    // justifyContent: 'center',
    width: Dimensions.get('window').width / 1.1,
    height: Dimensions.get('window').height / 5,
    marginHorizontal: 20,
    marginVertical: 5,
    zIndex: 1000,
    // backgroundColor: 'orange',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: Dimensions.get('window').height / 5,
    borderRadius: 16,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Vazirmatn',
    //marginLeft: 10,
    justifyContent: 'flex-start',
  },
});
export default HasWorkoutCard;
