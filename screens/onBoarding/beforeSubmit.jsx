import { Button, Text, useTheme } from '@rneui/themed';
import React, { useContext, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { IconOnBoardingLast } from '../marketplace/filters/icons';
import { I18n } from 'i18n-js';
import i18nt from '../../locales';
import LanguageContext from '../../api/langcontext';
import AuthContext from '../../api/context';

function BeforeSubmit({ onBeforeSubmitSelect, data }) {
  console.log('data', data);
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isSelected, setSelected] = useState(false);
  const { userLanguage } = useContext(LanguageContext);
  const i18n = new I18n(i18nt);
  i18n.locale = userLanguage;
  const { userAuth } = useContext(AuthContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Dimensions.get('window').height / 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
        }}>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('gender')}</Text>
          <Text style={styles.value}>{data[0].gender}</Text>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('age')}</Text>
          <Text style={styles.value}>{data[1].age}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
        }}>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('height')}</Text>
          <Text style={styles.value}>
            {data[2]?.height}
            <Text style={styles.unit}>{data[2]?.unit}</Text>
          </Text>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('weight')}</Text>
          <Text style={styles.value}>
            {data[3]?.weight}
            <Text style={styles.unit}>{data[3]?.unit}</Text>
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
        }}>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('mainGoal')}</Text>
          <Text style={styles.value}>{data[4]?.goal}</Text>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('level')}</Text>
          <Text style={styles.value}>{data[6]?.fitnessLevel}</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          //justifyContent: 'space-between',
        }}>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('daysperweek')}</Text>
          <Text style={styles.value}>{data[7]?.dayPreferences}</Text>
        </View>
        <View style={styles.halfBox}>
          <Text style={styles.title}>{i18n.t('location')}</Text>
          <Text style={styles.value}>{data[5]?.location}</Text>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    icon: {
      // marginRight: 10,
      // marginLeft: 10,
      // marginTop: 10,
      // // marginBottom: 10,
      // justifyContent: 'flex-start',
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
    },

    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      // paddingTop: Dimensions.get('window').height / 15,
    },
    title: {
      fontSize: 14,
      fontWeight: '400',
      //marginHorizontal: 20,
      marginTop: 0,
      color: theme.colors.grey0,
    },
    value: {
      fontSize: 16,
      fontWeight: '500',
      //marginHorizontal: 20,
      marginTop: 10,
      color: theme.colors.secondary,
    },
    fullBox: {
      //flex: 1,
      backgroundColor: theme.colors.background,
      //alignItems: 'ceer',
      marginHorizontal: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      height: Dimensions.get('window').height / 7,
      alignContent: 'center',
      justifyContent: 'center',
    },
    halfBox: {
      //flex: 1,
      backgroundColor: theme.colors.background,
      //alignItems: 'ceer',
      marginLeft: 20,
      // marginLeft: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 16,
      padding: 20,
      height: Dimensions.get('window').height / 10,
      width: Dimensions.get('window').width / 2 - 50,
      alignContent: 'center',
      justifyContent: 'center',
    },
    unit: {
      color: theme.colors.grey0,
      fontSize: 12,
      fontWeight: '400',
      paddingLeft: 15,
    },
  });

export default BeforeSubmit;
