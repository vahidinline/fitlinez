import { useNavigation } from '@react-navigation/core';
import { Skeleton, Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Dimensions, TouchableOpacity, View, PixelRatio } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import { Iconstar } from '../filters/icons';
import { LinearGradient } from 'expo-linear-gradient';

const SingleItem = ({ title, sub, level, star, mainTitle }) => {
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        marginVertical: 10,
        marginHorizontal: 10,
      }}>
      {title && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: Dimensions.get('window').width / 2.2,
          }}>
          <Text
            style={{
              color: mainTitle ? theme.colors.secondary : theme.colors.grey,
              fontSize: mainTitle ? 16 : 12,
              fontWeight: '500',
            }}>
            {title}
          </Text>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 14,
              fontWeight: '500',
            }}>
            {sub}
          </Text>
        </View>
      )}
      {level && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Iconstar size={32} color={theme.colors.gold} />
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: '500',
                marginHorizontal: 0,
              }}>
              {star}
            </Text>
          </View>
          <Chip
            style={{
              borderWidth: 1,
              borderColor:
                level === 'Beginner'
                  ? theme.colors.beginnerText
                  : level === 'Intermediate'
                  ? theme.colors.intermediateText
                  : theme.colors.advancedText,
              backgroundColor:
                level === 'Beginner'
                  ? theme.colors.beginnerbg
                  : level === 'Intermediate'
                  ? theme.colors.intermediatebg
                  : theme.colors.border,
            }}>
            {level}
          </Chip>
        </View>
      )}
    </View>
  );
};

function CardItem({ item }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PlanItem', {
          item: item,
        })
      }
      style={{
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 0,
        backgroundColor: theme.colors.background,
        shadowOpacity: 0,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <Card.Cover
          style={{
            width: Dimensions.get('window').width / 3,
            height: Dimensions.get('window').height / 3.5,
            resizeMode: 'cover',
            marginLeft: 10,
            marginVertical: 10,
          }}
          source={{ uri: item.image }}
        />

        <View
          style={{
            direction: RTL ? 'rtl' : 'ltr',
            //marginHorizontal: 10,
          }}>
          <SingleItem title={item.name} mainTitle={true} />
          <SingleItem title={i18n.t('trainer')} sub={item.creator} />
          <SingleItem
            title={i18n.t('duration')}
            sub={`${item.duration} ${i18n.t('week')}`}
          />
          <SingleItem title={i18n.t('target')} sub={item.target} />
          <SingleItem
            title={i18n.t('duration')}
            sub={`${item.duration} ${i18n.t('week')}`}
          />
          <SingleItem
            title={i18n.t('daysperweek')}
            sub={`${item.DaysPerWeek} ${i18n.t('daysinweek')}`}
          />
          <SingleItem level={item.level} star={item.star} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardItem;
