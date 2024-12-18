import { Skeleton, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { I18n } from 'i18n-js';
import CardItem from './CardItem';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import i18nt from '../../locales';

function ListItems({ packages, name, navigation }) {
  //console.log('packages in list item', packages);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  //const navigation = useNavigation();

  //console.log('navigation', navigation);

  const { theme } = useTheme();

  return (
    <View
      style={{
        paddingTop: 10,
        // height: Dimensions.get('window').height / 1.7,
      }}>
      {packages?.length === 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignContent: 'center',
            alignItems: 'center',
            marginTop: 20,
            marginHorizontal: 30,
            marginBottom: 20,
            borderRadius: 20,
          }}>
          <Skeleton
            skeletonStyle={{
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
              // borderWidth: 0.5,
              borderColor: theme.colors.border,
              marginHorizontal: 30,
            }}
            animation="pulse"
            width={Dimensions.get('window').width / 2}
            height={Dimensions.get('window').height / 3}
          />

          <Skeleton
            skeletonStyle={{
              backgroundColor: theme.colors.primary,
              borderRadius: 20,
              //borderWidth: 0.5,
              //borderColor: theme.colors.border,
              marginHorizontal: 30,
            }}
            animation="pulse"
            width={Dimensions.get('window').width / 1}
            height={Dimensions.get('window').height / 3}
          />
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          //marginTop: 20,
          marginBottom: 0,
          marginHorizontal: 10,
          backgroundColor: theme.colors.background,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginHorizontal: 20,
            marginTop: 0,
            fontFamily: 'Vazirmatn',
          }}>
          {name}
        </Text>
      </View>
      <View
        style={{
          // height: Dimensions.get('window').height / 1.7,
          marginTop: 10,
          marginBottom: 0,
          backgroundColor: theme.colors.background,
        }}>
        <FlatList
          horizontal
          data={packages}
          renderItem={({ item }) => <CardItem item={item} />}
          keyExtractor={(item) => item.name}
        />
      </View>
    </View>
  );
}

export default ListItems;
