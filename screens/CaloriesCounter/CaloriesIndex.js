import React, { useContext, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { IconWarning } from '../marketplace/filters/icons';
import AuthContext from '../../api/context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@rneui/themed';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import { I18n } from 'i18n-js';
import { Button } from '@rneui/base';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import CalorieDetails from './CalorieDetails';
import MealList from './MealList';

function CaloriesIndex() {
  const [status, setStatus] = useState('idle');
  const { userAuth } = useContext(AuthContext);
  const { theme } = useTheme();
  const userId = userAuth.id;
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const styles = getStyles(theme);

  const navigator = useNavigation();

  const menuList = [
    {
      id: 1,
      name: i18n.t('setdailycalories'),
      onPress: () => navigator.navigate('SetDailyCalories'),
      active: true,
    },
    {
      id: 2,
      name: i18n.t('seeHistory'),
      onPress: () => navigator.navigate('CalorieCustomReport'),
      active: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          borderBottomColor: theme.colors.border,
          borderBottomWidth: 1,
          marginBottom: 5,
          paddingBottom: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontFamily: 'Vazirmatn',
            color: theme.colors.secondary,
          }}>
          {i18n.t('calorieCounter')}
        </Text>
      </View>

      {status === 'error' && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <IconWarning color={theme.colors.warning} size={50} />
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              color: theme.colors.warning,
              margin: 20,
              marginBottom: 10,
              fontFamily: 'Vazirmatn',
            }}>
            {i18n.t('error')}
          </Text>
          <Button
            buttonStyle={{
              //backgroundColor: theme.colors.secondary,
              borderColor: theme.colors.primary,
              borderWidth: 0.2,
              margin: 10,
              borderRadius: 10,
              height: 40,
              width: 100,
            }}
            titleStyle={{
              color: theme.colors.primary,
              fontSize: 15,
              // fontWeight: 'bold',
              fontFamily: 'Vazirmatn',
            }}
            title={i18n.t('retry')}
            onPress={() => setStatus('mealInitialized')}
          />
        </View>
      )}
      <View
        style={{
          height: Dimensions.get('window').height / 4.5,
          widht: Dimensions.get('window').width / 1.1,
          borderColor: theme.colors.border,
          marginHorizontal: 20,
          //   borderWidth: 1,
          borderRadius: 8,
          backgroundColor: theme.colors.secondary,
        }}>
        <CalorieDetails userId={userId} />
      </View>

      {status === 'loading' && (
        <View
          style={{
            flex: 1,
            top: Dimensions.get('window').height / 4,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator
            animating={true}
            color={theme.colors.secondary}
            size="large"
          />
        </View>
      )}

      <MealList userId={userId} />

      <View
        style={{
          height: 50,
        }}>
        <FlatList
          horizontal
          data={menuList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.footerContainer}
              onPress={() => item.onPress()}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Vazirmatn',
                  color: theme.colors.secondary,
                }}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

export default CaloriesIndex;

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: 0,
      // height:Dimensions.get
      //marginBottom: 0,
      borderBottomColor: theme.colors.border,
      borderBottomWidth: 1,
    },
    footerContainer: {
      padding: 5,
      flexDirection: 'column',
      justifyContent: 'space-between',
      //  backgroundColor: 'white',
      marginHorizontal: 10,
      marginVertical: 5,
      //height: 50,
      //borderRadius: 10,
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
    },
    verticallySpaced: {
      marginVertical: 0,
      borderWidth: 0.3,
      marginHorizontal: 10,
      height: 0,
      borderRadius: 5,
      padding: 10,
      width: '95%',
    },
    mt20: {
      marginTop: 20,
    },
  });
