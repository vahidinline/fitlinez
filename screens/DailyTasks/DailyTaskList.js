import { Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  IconWalk,
  IconWalking,
  IconWeight,
  IconWorkout,
} from '../marketplace/filters/icons';
import { useNavigation } from '@react-navigation/native';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';

function DailyTaskList(item) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const isRTL = userLanguage === 'fa';
  console.log('item', item);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('SessionNavigator');
      }}
      style={{
        direction: isRTL ? 'rtl' : 'ltr',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.background,
        marginHorizontal: 10,
        height: 80,
        marginVertical: 8,
        borderRadius: 16,
        borderColor: theme.colors.border,
        borderWidth: 1,
        padding: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: 16,
        }}>
        <View
          style={{
            //  padding: 15,
            flexDirection: 'row',
            marginHorizontal: 10,
            alignItems: 'center',
          }}>
          {item.item.taskType === 'workout' && (
            <IconWorkout color={theme.colors.secondary} size={32} />
          )}
          {item.item.taskType === 'NEAT' && (
            <IconWalking color={theme.colors.secondary} size={32} />
          )}
          <Text
            style={{
              color: theme.colors.text,

              fontSize: 20,
              fontWeight: 'bold',
              marginHorizontal: 16,
              marginTop: 16,
              textDecorationLine:
                item.item.status === 'completed' ? 'line-through' : 'none',
              fontFamily: 'Vazirmatn',
            }}>
            {item.item.task}
          </Text>
        </View>
        <Text
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: theme.colors.text,
            fontSize: 12,
            //fontWeight: '500',
            top: 0,
            fontFamily: 'Vazirmatn',
            //marginHorizontal: 16,
          }}>
          {item.item.status === 'pending' && i18n.t('pending')}
          {item.item.status === 'completed' && i18n.t('completed')}
          {item.item.status === 'missed' && i18n.t('missed')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default DailyTaskList;
