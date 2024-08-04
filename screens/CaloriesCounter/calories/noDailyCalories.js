import React, { useContext, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import convertToPersianNumbers from '../../../api/PersianNumber';
import LanguageContext from '../../../api/langcontext';
import i18nt from '../../../locales';
import { useTheme } from '@rneui/themed';
import { I18n } from 'i18n-js';
import { Text } from '@rneui/base';

function NoDailyCalories() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa' ? true : false;
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const [status, setStatus] = useState('idle');
  return (
    <View
      style={{
        opacity: 0.5,
        // top: 100,
        //flex: 1,
        // justifyContent: 'center',
      }}>
      <View style={styles.baseContainer}>
        <Text style={styles.caloriesText}>
          <Text style={styles.kcalText}>
            {convertToPersianNumbers(1750, RTL)} {i18n.t('calories')}{' '}
            <Text style={styles.remainingText}>{i18n.t('remaining')}</Text>
          </Text>
        </Text>
      </View>

      <View style={styles.nutrientContainer}>
        <View style={styles.row}>
          <Text style={styles.nutrientText}>
            {i18n.t('carbs')}: {12 && convertToPersianNumbers(250, RTL)}{' '}
            {i18n.t('g')}
          </Text>
          <Text style={styles.nutrientText}>
            {i18n.t('protein')}: {12 && convertToPersianNumbers(112, RTL)}{' '}
            {i18n.t('g')}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.nutrientText}>
            {i18n.t('fats')}: {12 && convertToPersianNumbers(45, RTL)}{' '}
            {i18n.t('g')}
          </Text>
          <Text style={styles.nutrientText}>
            {i18n.t('fiber')}: {12 && convertToPersianNumbers(10, RTL)}{' '}
            {i18n.t('g')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme, RTL) =>
  StyleSheet.create({
    container: {
      row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      flex: 1,
      //backgroundColor: '#5B5891',
      justifyContent: 'center',
      alignItems: 'center',
      //marginHorizontal: 20,
      //flexDirection: 'row',
      //padding: 30,
      borderRadius: 14,
      width: Dimensions.get('window').width / 1.1,
      marginVertical: 10,
      // minHeight: Dimensions.get('window').height / 5,
      flex: 1,

      //marginHorizontal: 10,
      //padding: 10,
      borderRadius: 10,
      //backgroundColor: theme.colors.secondary,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 14,
    },
    noDataText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
    },
    baseContainer: {
      //  borderWidth: 5,
      //flex: 1,

      flexDirection: 'row',
      borderColor: theme.colors.grey0,
      borderRadius: 75,
      // width: 150,
      //height: 50,
      //margin: 5,
      borderOpacity: 0.2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    caloriesText: {
      color: theme.colors.primary,
      fontFamily: 'Vazirmatn',
      fontSize: 30,
      textAlign: 'center',
      //fontWeight: 'bold',
      // margin: 10,
    },
    kcalText: {
      color: theme.colors.primary,
      fontSize: 20,
      // textAlign: 'center',
      fontFamily: 'Vazirmatn',

      // marginHorizontal: 15,
    },
    remainingText: {
      // position: 'absolute',
      // top: 80,
      // right: 10,
      //  marginHorizontal: 12,
      color: theme.colors.primary,
      fontSize: 10,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
      //fontWeight: 'bold',
      margin: 5,
    },
    errorText: {
      color: theme.colors.warning,
      fontSize: 12,
      textAlign: 'center',
      fontFamily: 'Vazirmatn',
      //fontWeight: 'bold',
      margin: 10,
    },
    nutrientContainer: {
      //  alignItems: 'right',
      width: Dimensions.get('window').width / 1.3,
    },
    nutrientText: {
      direction: RTL ? 'rtl' : 'ltr',
      color: theme.colors.primary,
      fontSize: 14,
      // textAlign: 'center',
      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
      margin: 5,
    },
  });

export default NoDailyCalories;
