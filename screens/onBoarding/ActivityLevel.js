import { Button, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { useState } from 'react';
import { Dimensions, FlatList } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import ListComponent from './ListComponent';

function ActivityLevel({ onActivityLevelSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);

  const onSelect = ({ id, title, value, valueName }) => {
    setSelectedIds([id]);

    onActivityLevelSelect({
      activityLevel: valueName,
      title: title,
      value: value,
    });
  };
  const isSelected = (id) => selectedIds.includes(id);
  const data = [
    {
      id: 1,
      title: i18n.t('sedentary'),
      description: i18n.t('sedentaryDecs'),
      value: 1.2,
      valueName: 'sedentary',
    },
    {
      id: 2,
      title: i18n.t('lightExercise'),
      description: i18n.t('lightExercisedesc'),
      value: 1.375,
      valueName: 'light Exercise',
    },
    {
      id: 3,
      title: i18n.t('moderateExercise'),
      description: i18n.t('moderateExerciseDesc'),
      value: 1.465,
      valueName: 'moderate Exercise',
    },
    {
      id: 4,
      title: i18n.t('heavyExercise'),
      description: i18n.t('heavyExerciseDesc'),
      value: 1.725,
      valueName: 'heavy Exercise',
    },
  ];
  return (
    <View>
      <Text style={styles.title}>{i18n.t('activityLevel')}</Text>
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

export default ActivityLevel;
