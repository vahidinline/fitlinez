import { Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import {
  IconInfo,
  IconTickCircle,
  IconWalking,
  IconWorkout,
} from '../marketplace/filters/icons';
import { useNavigation } from '@react-navigation/native';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import AuthContext from '../../api/context';

function DailyTaskList(item, { title }) {
  //console.log('title in daily task', title);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const { userAuth } = useContext(AuthContext);
  const userLevel = userAuth.level;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';

  const handleNextStep = () => {
    if (userLevel === 4) {
      // condition 1
      navigation.navigate('SessionNavigator', {
        screen: 'StartSessionIndex',
        params: { title: title },
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
    <TouchableOpacity
      onPress={handleNextStep}
      style={{
        position: 'absolute',
        // direction: isRTL ? 'rtl' : 'ltr',

        backgroundColor: theme.colors.background,
        marginHorizontal: 5,
        height: Dimensions.get('window').height / 12,
        width: Dimensions.get('window').width / 1.2,
        top: 40,
        //marginTop: 35,
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 5,
        // borderColor: theme.colors.border,
        // borderWidth: 1,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 0,
        }}>
        <View
          style={{
            paddingVertical: 0,
            flexDirection: 'row',
            marginHorizontal: 0,
            alignItems: 'center',
          }}>
          {item?.item?.taskType === 'workout' && (
            <IconWorkout color={theme.colors.secondary} size={48} />
          )}
          {item?.item?.taskType === 'NEAT' && (
            <IconWalking color={theme.colors.secondary} size={48} />
          )}
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 20,
              fontWeight: 'bold',
              marginHorizontal: 16,
              marginTop: 10,
              textDecorationLine:
                item.item.status === 'completed' ? 'line-through' : 'none',
              fontFamily: 'Vazirmatn',
            }}>
            {item?.item?.task}
          </Text>
        </View>
        <View
          style={{
            color: theme.colors.text,

            //fontWeight: '500',
            top: 5,

            //marginHorizontal: 16,
          }}>
          {item.item.status === 'pending' && (
            <IconInfo
              color={theme.colors.warning}
              size={48}
              fill={theme.colors.warning}
            />
          )}
          {item.item.status === 'completed' && (
            <IconTickCircle
              color={theme.colors.white}
              size={48}
              fill={theme.colors.green}
            />
          )}
          {item.item.status === 'missed' && (
            <Text
              style={{
                color: theme.colors.warning,
                fontSize: 20,
                fontWeight: 'bold',
                marginHorizontal: 0,
                marginTop: 16,
                fontFamily: 'Vazirmatn',
              }}>
              {i18n.t('missed')}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default DailyTaskList;
