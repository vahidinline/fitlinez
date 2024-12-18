import { useNavigation } from '@react-navigation/core';
import { Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import { Dimensions, View } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';
import { Image } from 'react-native-expo-image-cache';
import { Button } from '@rneui/base';
import { savePackages } from '../../../api/assignNewPlan';
import AuthContext from '../../../api/context';

const SingleItem = ({ title, sub, level, location, mainTitle }) => {
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
              fontWeight: '700',
              fontFamily: 'Vazirmatn',
            }}>
            {title}
          </Text>

          <Text
            style={{
              color: theme.colors.text,
              fontSize: 14,
              fontWeight: '500',
              fontFamily: 'Vazirmatn',
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
              //alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 12,
                fontWeight: '500',
                marginHorizontal: 0,
                fontFamily: 'Vazirmatn',
              }}>
              {location === 'both' ? 'Gym & Home' : location}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

function CardItem({ item, status, setStatus }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const userAuth = useContext(AuthContext);
  const userId = userAuth.userAuth.id;

  const handleSavePackages = async (item, userId, navigation) => {
    try {
      setStatus('loading');
      await savePackages(item, userId, navigation);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.log(error);
    }
  };
  return (
    <View
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
        <Image
          style={{
            width: Dimensions.get('window').width / 3,
            height: Dimensions.get('window').height / 3.3,
            resizeMode: 'cover',
            marginLeft: 10,
            marginVertical: 10,
            borderRadius: 16,
          }}
          {...{
            uri: item.image,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
          }}>
          <Chip
            style={{
              borderWidth: 1,
              opacity: 0.8,
              width: '100%',

              borderColor:
                item.level === 'Beginner'
                  ? theme.colors.beginnerText
                  : item.level === 'Intermediate'
                  ? theme.colors.intermediateText
                  : theme.colors.advancedText,
              backgroundColor:
                item.level === 'Beginner'
                  ? theme.colors.beginnerbg
                  : item.level === 'Intermediate'
                  ? theme.colors.intermediatebg
                  : theme.colors.border,
            }}>
            {item.level}
          </Chip>
        </View>
        <View
          style={{
            direction: RTL ? 'rtl' : 'ltr',
            //marginHorizontal: 10,
          }}>
          <SingleItem title={item.name} mainTitle={true} />
          <SingleItem title={i18n.t('trainer')} sub={item.creator} />
          <SingleItem
            title={i18n.t('sutablefor')}
            sub={item.location === 'both' ? 'Gym & Home' : item.location}
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
          {/* <SingleItem level={item.level} location={item.location} /> */}
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 10,
          marginHorizontal: 20,
        }}>
        <Button
          buttonStyle={{
            backgroundColor: theme.colors.secondary,
            borderRadius: 10,
            width: 130,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 10,
          }}
          titleStyle={{
            color: theme.colors.white,
            fontSize: 14,
            fontWeight: '700',
            fontFamily: 'Vazirmatn',
          }}
          onPress={() => handleSavePackages(item, userId, navigation)}
          style={{ marginHorizontal: 10, marginVertical: 10 }}>
          {i18n.t('addtoyourplan')}
        </Button>
        <Button
          buttonStyle={{
            backgroundColor: theme.colors.warning,
            borderRadius: 10,
            width: 130,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 10,
          }}
          titleStyle={{
            color: theme.colors.white,
            fontSize: 14,
            fontWeight: '700',
            fontFamily: 'Vazirmatn',
          }}
          onPress={() =>
            navigation.navigate('PlanItem', {
              item: item,
            })
          }
          style={{ marginHorizontal: 10, marginVertical: 10 }}>
          {i18n.t('seeDetails')}
        </Button>
      </View>
    </View>
  );
}

export default CardItem;
