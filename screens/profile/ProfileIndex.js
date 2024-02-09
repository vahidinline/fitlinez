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
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="40"
            viewBox="0 0 24 24"
            fill="none">
            <Path
              d="M15.9761 13.8762L15.9772 13.8741C16.3331 13.1623 17.0306 12.7305 17.82 12.7305H21.3C21.4092 12.7305 21.5 12.822 21.5 12.9305V16.7608C21.3747 18.3224 20.8245 19.4902 19.9548 20.2709C19.0796 21.0565 17.8245 21.5005 16.2 21.5005H7.82C6.09938 21.5005 4.78319 20.9895 3.89789 20.1075C3.01283 19.2258 2.5 17.915 2.5 16.2005V12.9405C2.5 12.8266 2.58614 12.7405 2.7 12.7405H6.2C6.97773 12.7405 7.68723 13.1811 8.04382 13.8861L8.04442 13.8873L8.88363 15.5358C9.07374 15.9152 9.33243 16.1609 9.62377 16.3026C9.9059 16.4398 10.1799 16.4605 10.37 16.4605H13.65C14.2829 16.4605 14.8535 16.1004 15.1367 15.5352C15.1368 15.5348 15.137 15.5345 15.1372 15.5341L15.9761 13.8762Z"
              fill="#5B5891"
              stroke="#5B5891"
            />
            <Path
              d="M12 1.75C12.1339 1.75 12.25 1.86614 12.25 2V3.5H11.75V2C11.75 1.86614 11.8661 1.75 12 1.75Z"
              fill="#5B5891"
              stroke="#5B5891"
            />
            <Path
              d="M2.7 10.23C2.63344 10.23 2.56668 10.2325 2.5 10.2375V9.81C2.5 8.08944 3.01093 6.77618 3.89355 5.89355C4.77618 5.01093 6.08944 4.5 7.81 4.5H10.75V6.00063C10.2618 5.63487 9.55942 5.67348 9.11645 6.11645C8.63118 6.60171 8.63118 7.39829 9.11645 7.88355L10.99 9.75711V9.77997L11.1646 9.92963C11.2511 10.0037 11.3714 10.0959 11.5289 10.1561C11.6752 10.2141 11.827 10.25 12 10.25C12.1646 10.25 12.3169 10.2175 12.4621 10.156C12.6286 10.0957 12.7744 9.99274 12.8836 9.88355L14.8836 7.88355C15.3688 7.39829 15.3688 6.60171 14.8836 6.11645C14.4406 5.67348 13.7382 5.63487 13.25 6.00063V4.5H16.19C17.9106 4.5 19.2238 5.01093 20.1064 5.89355C20.9891 6.77618 21.5 8.08944 21.5 9.81V10.2375C21.4333 10.2325 21.3666 10.23 21.3 10.23H17.82C16.0813 10.23 14.5184 11.1963 13.7434 12.7452C13.7432 12.7456 13.743 12.746 13.7428 12.7464L13.1328 13.95H10.8862L10.2766 12.7551C9.50157 11.1963 7.93866 10.23 6.2 10.23H2.7Z"
              fill="#5B5891"
              stroke="#5B5891"
            />
          </Svg>
        </View>
        <UserImagePicker setAvatar={setAvatar} />
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
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="40"
            viewBox="0 0 24 24"
            fill="none">
            <Path
              d="M17 21.5H7C6.86614 21.5 6.75 21.3839 6.75 21.25C6.75 21.1161 6.86614 21 7 21H17C17.1339 21 17.25 21.1161 17.25 21.25C17.25 21.3839 17.1339 21.5 17 21.5Z"
              fill="#5B5891"
              stroke="#5B5891"
            />
            <Path
              d="M20.6426 5.92454L20.6408 5.9258L16.6413 8.78541L20.6426 5.92454ZM20.6426 5.92454C21.0357 5.64086 21.56 6.03351 21.3904 6.49738L21.3891 6.50092L17.2294 18.1501C17.2294 18.1503 17.2293 18.1504 17.2293 18.1505C17.1602 18.3422 16.9683 18.4791 16.76 18.4791H7.23001C7.01559 18.4791 6.8295 18.3469 6.76193 18.1539L6.76194 18.1539L6.76089 18.1509L2.60122 6.50186C2.60117 6.50172 2.60112 6.50158 2.60107 6.50144C2.43831 6.04161 2.96137 5.63254 3.37154 5.91747L7.36666 8.77398C8.16883 9.36131 9.29457 9.00786 9.63821 8.08452C9.6384 8.084 9.6386 8.08348 9.63879 8.08297L11.5377 3.05574L11.5378 3.05575L11.5393 3.05167C11.6987 2.61819 12.3113 2.61819 12.4707 3.05167L12.4707 3.05167L12.4718 3.05462L14.3618 8.09462L14.3622 8.09546M20.6426 5.92454L14.3622 8.09546M14.3622 8.09546C14.7081 9.01305 15.8439 9.35664 16.6408 8.78579L14.3622 8.09546ZM9.50001 15.2491H14.5C15.1861 15.2491 15.75 14.6852 15.75 13.9991C15.75 13.3129 15.1861 12.7491 14.5 12.7491H9.50001C8.81386 12.7491 8.25001 13.3129 8.25001 13.9991C8.25001 14.6852 8.81386 15.2491 9.50001 15.2491Z"
              fill="#5B5891"
              stroke="#5B5891"
            />
          </Svg>
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
