import { useNavigation } from '@react-navigation/core';
import { Button, Text, useTheme } from '@rneui/themed';
import { Icon } from 'iconsax-react-native';
import React, { useContext } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { Card, Chip, Divider, List } from 'react-native-paper';
import { Svg, Path } from 'react-native-svg';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { I18n } from 'i18n-js';

function CardItem({ item }) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <Card
      onPress={() => navigation.navigate('PlanItem', { item: item })}
      style={{
        borderRadius: 20,

        marginHorizontal: 20,
        marginBottom: 20,
        marginTop: 0,
        backgroundColor: theme.colors.background,
        shadowOpacity: 0,
        borderWidth: 1,
        borderColor: theme.colors.border,
        direction: userLanguage === 'fa' ? 'rtl' : 'ltr',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
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
            flexDirection: 'column',
          }}>
          <Text
            style={{
              fontSize: 16,
              justifyContent: 'center',
              //alignSelf: 'center',
              marginVertical: 0,
              marginHorizontal: 20,
              fontWeight: '500',
              color: theme.colors.secondary,
            }}>
            {item.name}
          </Text>
          <View
            style={{
              //marginHorizontal: 10, // Add some margin to the right of each item
              //justifyContent: 'space-between',
              marginLeft: 20, // Add some margin to the right of each item
              marginRight: 10, // Add some margin to the right of each item
              //marginTop: 30,
              //marginRight: 40,
            }}>
            <List.Item
              titleStyle={{
                justifyContent: 'flex-end',
              }}
              right={(props) => <Text>{item.creator}</Text>}
              left={(props) => <Text>{`${i18n.t('trainer')}:`}</Text>}
            />
            <List.Item
              right={(props) => (
                <Text>{`${item.duration} ${i18n.t('week')}`}</Text>
              )}
              left={(props) => <Text>{`${i18n.t('duration')}:`}</Text>}
            />
            <List.Item
              right={(props) => <Text>{item.target}</Text>}
              left={(props) => <Text>{`${i18n.t('target')}:`}</Text>}
            />
            <List.Item
              right={(props) => (
                <Text>{`${item.DaysPerWeek} ${i18n.t('days')}`}</Text>
              )}
              left={(props) => <Text>{`${i18n.t('daysperweek')}:`}</Text>}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              //justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <Chip
              style={{
                //backgroundColor: theme.colors.primary,
                marginHorizontal: 10,
                //width: Dimensions.get('window').width / 3,
              }}>
              {item.level}
            </Chip>
            {item?.star && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  //marginHorizontal: 16,
                }}>
                <Text>4.5</Text>
                <Svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none">
                  <Path
                    d="M15.9978 23.36L21.5312 26.7067C22.5445 27.32 23.7845 26.4133 23.5178 25.2667L22.0512 18.9733L26.9445 14.7333C27.8378 13.96 27.3578 12.4933 26.1845 12.4L19.7445 11.8533L17.2245 5.90668C16.7712 4.82668 15.2245 4.82668 14.7712 5.90668L12.2512 11.84L5.81117 12.3867C4.63784 12.48 4.15784 13.9467 5.05117 14.72L9.94451 18.96L8.47784 25.2533C8.21117 26.4 9.45117 27.3067 10.4645 26.6933L15.9978 23.36Z"
                    fill="#FABB05"
                  />
                </Svg>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
}

export default CardItem;
