import { Button, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Icon8,
  IconHomeFocused,
  IconWeight,
} from '../marketplace/filters/icons';
import ListComponent from './ListComponent';

function LocationSelection({ onLocationSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);

  const data = [
    {
      id: 1,
      title: i18n.t('homelocation'),
      value: 'Home',
      //  description: 'I’m new to this',
      // icon: IconHomeFocused,
    },
    // {
    //   id: 2,
    //   title: 'Small Gym',
    //   description: 'I workout sometimes',
    //   icon: 'dumbbell',
    // },
    // {
    //   id: 3,
    //   title: i18n.t('bothlocation'),
    //   //  description: 'I workout regularly',
    //   // icon: Icon8,
    // },
    {
      id: 4,
      title: i18n.t('gymlocation'),
      value: 'Gym',
      //  description: 'I workout regularly',
      //icon: IconWeight,
    },
  ];

  const onSelect = ({ id, title, value }) => {
    setSelectedIds([id]);
    console.log(title, id);
    onLocationSelect({
      location: value,
      value: title,
    });
  };

  const isSelected = (id) => selectedIds.includes(id);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('preferedLocation')}</Text>
      <View style={styles.container}>
        <ListComponent
          data={data}
          onSelect={onSelect}
          isSelected={isSelected}
        />
      </View>
    </View>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    icon: {
      marginRight: 10,
      marginLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      justifyContent: 'flex-start',
    },
    container: {
      flexDirection: 'column',
    },
    button: {
      marginTop: 20,
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.secondary,
      borderWidth: 0.3,
      borderRadius: 20,
      width: '100%',
      height: 80,
      justifyContent: 'flex-start',
      paddingLeft: 20,
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 16,
      fontWeight: '500',
      justifyContent: 'flex-start',
      marginLeft: 10,
      fontFamily: 'Vazirmatn',
    },
    title: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
      fontFamily: 'Vazirmatn',
    },
  });

export default LocationSelection;
