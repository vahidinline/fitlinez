import { useNavigation } from '@react-navigation/native';
import { Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Card, Chip } from 'react-native-paper';

import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';

const SingleItem = ({ title, sub, level, location, mainTitle }) => {
  const { theme } = useTheme();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View
      style={{
        //flexDirection: 'row',

        marginVertical: 10,
        marginHorizontal: 10,
      }}>
      {title && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            // alignItems: 'center',
          }}>
          <Text
            style={{
              color: mainTitle ? theme.colors.secondary : theme.colors.grey,
              fontSize: mainTitle ? 16 : 12,
              fontWeight: '500',
              fontFamily: 'Vazirmatn',
              //marginHorizontal: 10,
            }}>
            {title}
          </Text>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 14,
              fontWeight: '500',
              fontFamily: 'Vazirmatn',
              //marginHorizontal: 10,
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
            // alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',

              // alignItems: 'center',
              //marginLeft: 10,
            }}>
            {/* <Iconstar size={32} color={theme.colors.gold} /> */}
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 12,
                fontWeight: '500',
                marginHorizontal: 5,
                fontFamily: 'Vazirmatn',
              }}>
              {location}
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
      //onPress={() => navigation.navigate('PlanItem', { item: item })}
      onPress={() => navigation.navigate('PlanItem', { item: item })}
      style={{
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 0,
        backgroundColor: theme.colors.background,
        shadowOpacity: 0,
        borderWidth: 0.5,
        borderColor: theme.colors.border,
        //height: Dimensions.get('window').height / 2,
      }}>
      <View
        style={{
          flexDirection: 'column',
        }}>
        <Card.Cover
          style={{
            width: Dimensions.get('window').width / 2,
            height: Dimensions.get('window').height / 6,
            resizeMode: 'cover',
            marginHorizontal: 10,
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
            title={i18n.t('daysperweek')}
            sub={`${item.DaysPerWeek} ${i18n.t('daysinweek')}`}
          />
          <SingleItem
            level={item.level}
            // star={item.star}
            location={item.locarion}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default CardItem;
