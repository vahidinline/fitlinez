import { Text, useTheme } from '@rneui/themed';
import React, { useContext } from 'react';
import LanguageContext from '../../api/langcontext';
import i18nt from '../../locales';
import { I18n } from 'i18n-js';
import { View, StyleSheet, Dimensions } from 'react-native';
import convertToPersianNumbers from '../../api/PersianNumber';

function ItemResults({ title, amount, unit }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const { userLanguage } = useContext(LanguageContext);
  const RTL = userLanguage === 'fa';
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  return (
    <View style={styles.list}>
      <Text style={styles.itemText}>{title}</Text>

      <Text style={styles.itemUnit}>
        <Text style={styles.itemValue}>{`${amount}`}</Text>
        {`${i18n.t(unit)}`}
      </Text>
    </View>
  );
}

export default ItemResults;

const getStyles = (theme) =>
  StyleSheet.create({
    buttontitle: {
      color: theme.colors.primary,
      fontSize: 16,
      //  fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },

    container: {
      flex: 1,
      justifyContent: 'center',
      //padding: 5,
      height: Dimensions.get('window').height,
      borderRadius: 10,

      // borderWidth: 0.3,
      // borderColor: theme.colors.border,
      backgroundColor: theme.colors.backgroundColor,
      margin: 4,

      //backgroundColor: theme.colors.grey5,
      //height: Dimensions.get('window').height / 2,
    },
    card: {
      padding: 5,
      margin: 5,
      backgroundColor: theme.colors.grey5,
    },
    footerContainer: {
      padding: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    listTitle: {
      flexDirection: 'row',
      justifyContent: 'center',
      margin: 10,
      // borderWidth: 0.2,
      padding: 10,
      borderRadius: 5,
      borderColor: theme.colors.border,
      //top: 10,
      // backgroundColor: theme.colors.grey2,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    list: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      borderBottomWidth: 0.3,
      borderBottomColor: theme.colors.border,
      paddingBottom: 2,
      fontFamily: 'Vazirmatn',
      textAlign: 'center',
    },
    input: {
      height: 40,
      color: theme.colors.secondary,
      fontSize: 14,
    },
    itemUnit: {
      color: theme.colors.secondary,
      fontSize: 10,
      marginTop: 5,

      fontFamily: 'Vazirmatn',
    },
    button: {
      //margin: 10,
      //padding: 10,
      width: Dimensions.get('window').width / 2.5,
      height: 40,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 10,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.button,
    },
    itemText: {
      color: theme.colors.secondary,
      fontSize: 16,
      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    itemValue: {
      color: theme.colors.secondary,
      fontSize: 16,
      fontFamily: 'Vazirmatn',
      marginHorizontal: 5,
    },
    itemTitle: {
      color: theme.colors.warning,
      fontSize: 18,
      textAlign: 'center',
      justifyContent: 'center',

      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
    itemServingSize: {
      color: theme.colors.secondary,
      fontSize: 12,
      textAlign: 'center',
      justifyContent: 'center',

      // fontWeight: 'bold',
      fontFamily: 'Vazirmatn',
    },
  });
