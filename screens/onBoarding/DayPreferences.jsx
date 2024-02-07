import { Button, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ListComponent from './ListComponent';
import { useState } from 'react';

function DayPreferences({ onDayPreferencesSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);

  const data = [
    {
      id: 1,
      title: i18n.t('lesstahn3days'),
      description: 'I’m new to this',
    },
    {
      id: 2,
      title: i18n.t('threedays'),
      description: 'I workout sometimes',
    },
    {
      id: 3,
      title: i18n.t('fourdays'),
      description: 'I workout regularly',
    },
    {
      id: 4,
      title: i18n.t('moretahn4days'),
      description: 'I workout regularly',
    },
  ];

  const onSelect = ({ id, title }) => {
    setSelectedIds([id]);
    console.log(title, id);
    onDayPreferencesSelect({
      dayPreferences: title,
    });
  };

  const isSelected = (id) => selectedIds.includes(id);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('daypreference')}</Text>
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
    },
    text: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'flex-start',
    },
    title: {
      color: theme.colors.secondary,
      fontSize: 20,
      fontWeight: 'bold',
      justifyContent: 'center',
      alignSelf: 'center',
      marginBottom: 100,
    },
  });

export default DayPreferences;
