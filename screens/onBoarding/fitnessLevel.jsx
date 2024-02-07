import { Button, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import ListComponent from './ListComponent';

function FitnessLevel({ onFitnessLevelSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);

  const onSelect = ({ id, title }) => {
    setSelectedIds([id]);

    onFitnessLevelSelect({
      fitnessLevel: title,
    });
  };
  const isSelected = (id) => selectedIds.includes(id);
  const data = [
    {
      id: 1,
      title: i18n.t('beginner'),
      description: 'I’m new to this',
    },
    {
      id: 2,
      title: i18n.t('intermediate'),
      description: 'I workout sometimes',
    },
    {
      id: 3,
      title: i18n.t('advanced'),
      description: 'I workout regularly',
    },
  ];
  return (
    <View>
      <Text style={styles.title}>{i18n.t('fitnessLevel')}</Text>
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
      color: theme.colors.black,
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

export default FitnessLevel;
