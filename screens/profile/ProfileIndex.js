import React from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import UserImagePicker from '../../components/userData/userImage';
import { useState } from 'react';
import Box from './Box';
import { ListItem, Text, ThemeContext, useTheme } from '@rneui/themed';
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
  IconUnit,
  IconArrow,
  IconWeight,
  IconReport,
  IconTrash,
  IconLogOut,
  IconInbox,
  IconLeaderboard,
} from '../marketplace/filters/icons';
import { UnitContext } from '../../api/unitContext';

const deleteAccount = () => {
  Alert.alert(
    'Delete Account  ',
    'Are you sure you want to Delete your account?',
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          Alert.alert(
            'Account Deletion request has been recieved. Your account will be removed within 2 business days'
          ) + console.log(userAuth.id),
      },
    ],
    { cancelable: false }
  );
};

function ProfileIndex() {
  const key = 'fitlinez-session';
  const { unit, setUnit } = useContext(UnitContext);
  const [isFocus, setIsFocus] = useState(false);
  const [value, setValue] = useState(null);
  const navigation = useNavigation();
  const { userLanguage, setUserLanguage } = useContext(LanguageContext);
  const { userAuth, setUserAuth } = useContext(AuthContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { toggleTheme } = useContext(ThemeContext);
  const [avatar, setAvatar] = useState(null);
  const { theme } = useTheme();
  const userLevel = userAuth.level;
  console;
  const handleLogOut = () => {
    setUserAuth(null);
    AuthStorage.removeToken();
  };

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

    // {
    //   id: 2,
    //   name: i18n.t('unit'),
    //   icon: IconUnit,
    //   sub: unit,
    //   func: () => navigation.navigate('UnitSelector'),
    // },
    {
      id: 3,
      name: i18n.t('report'),
      icon: IconReport,
      func: () => {
        navigation.navigate('CustomReport');
      },
    },

    // {
    //   id: 6,
    //   name: 'Reset Plan',
    //   icon: IconProfile,
    //   func: () => dropDatabases(),
    // },
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
          justifyContent: 'space-between',
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
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#5B5891',
            width: 50,
            height: 50,
            alignContent: 'center',
            alignItems: 'center',
            //alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <IconInbox />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 0,
            marginHorizontal: 10,

            alignContent: 'center',
            alignItems: 'center',
            //alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <UserImagePicker setAvatar={setAvatar} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 0,
            marginHorizontal: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#5B5891',
            width: 50,
            height: 50,
            alignContent: 'center',
            alignItems: 'center',
            //alignSelf: 'center',
            justifyContent: 'center',
          }}>
          <IconLeaderboard />
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
              title={i18n.t('upgradeHeaderText')}
              subTitle={i18n.t('upgradeSmallText')}
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
            //borderWidth: 1,
            borderRadius: 10,
            //borderColor: '#5B5891',
            // width: 50,
            // height: 50,
            alignContent: 'center',
            alignItems: 'center',
            //alignSelf: 'center',
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
                        // top: 15,
                        marginLeft: 10,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: item.id !== 5 ? '300' : '500',
                          color: item.id !== 5 ? theme.colors.text : 'red',
                          marginLeft: 10,
                          //position: 'absolute',
                          //right: 180,
                          //top: -10,
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
                            //position: 'absolute',
                            //right: 180,
                            //top: -10,
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
