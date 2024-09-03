import { Button, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import ListComponent from './ListComponent';

function GoalSelection({ onGoalSelect, i18n }) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);

  const onSelect = ({ id, title }) => {
    setSelectedIds([id]);
    console.log(title, id);
    onGoalSelect({
      mainGoal: title,
      id: id,
    });
  };
  const isSelected = (id) => selectedIds.includes(id);

  const data = [
    {
      id: 1,
      title: i18n.t('loseFat'),
      // description: 'Get a personalized nutrition plan to lose fat',
    },
    {
      id: 2,
      title: i18n.t('gainMuscle'),
      // description: 'Get a personalized nutrition plan to build muscle',
    },
    {
      id: 3,
      title: i18n.t('maintainWeight'),
      //description: 'Get a personalized nutrition plan to maintain weight',
    },
    {
      id: 4,
      title: i18n.t('stayFit'),
      //description: 'Get a personalized nutrition plan to maintain weight',
    },
  ];
  return (
    <View>
      <Text style={styles.title}>{i18n.t('mainFitnessGoal')}</Text>
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
      fontSize: 16,
      fontWeight: '500',
      justifyContent: 'flex-start',
      alignSelf: 'center',
      marginLeft: 10,
      alignContent: 'center',
      alignItems: 'center',
      top: 10,
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
    selectedItem: {
      borderColor: theme.colors.secondary,
      backgroundColor: theme.colors.selected,
      borderWidth: 2,
    },
  });

export default GoalSelection;
