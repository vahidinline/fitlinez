import { Button, Icon, Skeleton, Text, useTheme } from '@rneui/themed';
import { SearchBar } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import axios from 'axios';
import { I18n } from 'i18n-js';
import { useEffect } from 'react';
import { useState } from 'react';
import { Pressable } from 'react-native';
import CardItem from './CardItem';
import LanguageContext from '../../api/langcontext';
import { useContext } from 'react';
import i18nt from '../../locales';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
const db = SQLite.openDatabase('packeges.db');

function ListItems({ packages, name, navigation }) {
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
            justifyContent: 'center',
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
              borderWidth: 0.5,
              borderColor: theme.colors.border,
            }}
            animation="pulse"
            width={Dimensions.get('window').width / 1.7}
            height={Dimensions.get('window').height / 3}
          />

          <Skeleton
            LinearGradientComponent={LinearGradient}
            animation="wave"
            width={80}
            height={40}
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
          }}>
          {name}
        </Text>

        <Text
          onPress={() => {
            //console.log('see all');
            navigation.navigate('WorkoutListIndex', {
              packages: packages,
              name: name,
            });
          }}
          style={{
            fontSize: 15,
            //fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 0,
            textDecorationLine: 'underline',
            color: theme.colors.secondary,
          }}>
          {i18n.t('seeAll')}
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
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
}

export default ListItems;
