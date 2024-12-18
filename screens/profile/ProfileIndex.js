import React, { useEffect } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import UserImagePicker from '../../components/userData/userImage';
import { useState } from 'react';
import Box from './Box';
import { Text, ThemeContext, useTheme } from '@rneui/themed';
import AuthStorage from '../../api/storage';
import { useNavigation } from '@react-navigation/native';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import AuthContext from '../../api/context';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { List } from 'react-native-paper';
import {
  IconProfile,
  IconArrow,
  IconReport,
  IconLogOut,
} from '../marketplace/filters/icons';
import moment from 'moment';
import { IconWeight } from '../marketplace/filters/icons';

function ProfileIndex() {
  const key = 'fitlinez-session';
  const [dayLeft, setDayLeft] = useState(0);
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [avatar, setAvatar] = useState(null);
  const { theme } = useTheme();
  const userLevel = userAuth.level;
  const ExpireDate = userAuth.ExpireDate ? userAuth.ExpireDate : null;
  const DayLeftPremium = moment(ExpireDate).diff(moment(), 'days');

  const handleLogOut = () => {
    setUserAuth(null);
    AuthStorage.removeToken();
  };

  const FreeTrialLeft = (userAuth) => {
    const { date } = userAuth;
    const today = new Date();
    const start = new Date(date);
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysLeft = 14 - diffDays;
    setDayLeft(daysLeft);
    const result = daysLeft > 0 ? true : false;

    return result;
  };

  useEffect(() => {
    if (userLevel !== 4) {
      FreeTrialLeft(userAuth);
    } else {
      setDayLeft(10);
    }
  }, [userAuth]);

  const exitAlert = () => {
    Alert.alert(
      'Exit  ',
      'Are you sure you want to LogOut?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => handleLogOut() },
      ],
      { cancelable: false }
    );
  };
  const setting = [
    {
      id: 1,
      name: i18n.t('aboutme'),
      icon: IconProfile,
      func: () => navigation.navigate('Aboutme'),
    },

    {
      id: 3,
      name: i18n.t('report'),
      icon: IconReport,
      func: () => {
        navigation.navigate('CustomReport');
      },
    },

    {
      id: 7,
      name: i18n.t('changeWorkoutPlan'),
      icon: IconWeight,
      func: () => navigation.navigate('WorkoutListIndex'),
    },
    {
      id: 5,
      name: i18n.t('logout'),
      icon: IconLogOut,
      func: () => exitAlert(),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
          marginBottom: 0,
          marginHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 0,
            marginHorizontal: 10,

            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <UserImagePicker setAvatar={setAvatar} />
          <View
            style={{
              position: 'absolute',

              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: theme.colors.text,
                // marginLeft: 10,
                marginTop: 10,
                opacity: 0.4,
                fontFamily: 'Vazirmatn',
              }}>
              {userAuth.name}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          marginTop: 90,
          marginBottom: 0,
          marginHorizontal: 10,
          //backgroundColor: theme.colors.red,
          borderRadius: 24,
        }}>
        {userLevel !== 4 && (
          <TouchableOpacity onPress={() => navigation.navigate('Upgrade')}>
            <Box
              type="free"
              dayLeft={dayLeft}
              title={i18n.t('upgradeHeaderText', { dayLeft: dayLeft })}
              subTitle={i18n.t('upgradeSmallText')}
            />
          </TouchableOpacity>
        )}
        {userLevel === 4 && (
          <TouchableOpacity onPress={() => navigation.navigate('Upgrade')}>
            <Box
              type="premium"
              dayLeft={DayLeftPremium}
              title={i18n.t('PremiumHeaderText', { dayLeft: DayLeftPremium })}
              subTitle={i18n.t('PremiumSubHeaderText')}
            />
          </TouchableOpacity>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 0,
            marginLeft: 10,
            borderRadius: 10,
            alignContent: 'center',
            justifyContent: 'center',
          }}>
          <FlatList
            data={setting}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={() => {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        alignContent: 'center',
                        alignItems: 'center',

                        marginLeft: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: item.id !== 5 ? '300' : '500',
                          color: item.id !== 5 ? theme.colors.text : 'red',
                          marginLeft: 10,

                          fontFamily: 'Vazirmatn',
                        }}>
                        {item.name}
                      </Text>
                      {item.sub && (
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: item.id !== 5 ? '300' : '500',
                            color: item.id !== 5 ? theme.colors.text : 'red',
                            marginLeft: 10,

                            fontFamily: 'Vazirmatn',
                          }}>
                          {item.sub[0].massureUnit} / {item.sub[1].weightUnit}
                        </Text>
                      )}
                    </View>
                  );
                }}
                onPress={() => item.func()}
                right={(props) => item.id !== 5 && <IconArrow {...props} />}
                left={(props) => {
                  const Icon = item.icon;
                  return <Icon {...props} />;
                }}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default ProfileIndex;
