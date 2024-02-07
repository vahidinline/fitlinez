import { Button, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Neck from '../../assets/img/neckPain.jpeg';
import Knee from '../../assets/img/kneePain.jpeg';
import Shoulder from '../../assets/img/ShoulderPain.jpeg';
import { Card } from 'react-native-paper';

function DisabilitiesSelection() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [selectedIds, setSelectedIds] = useState([]);
  console.log(selectedIds);
  const onSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const isSelected = (id) => selectedIds.includes(id);

  const data = [
    {
      id: 1,
      title: 'knee',
      img: Knee,
    },
    {
      id: 2,
      title: 'neck',
      img: Neck,
    },
    {
      id: 3,
      title: 'Shoulder',
      img: Shoulder,
    },
  ];
  return (
    <View>
      <Text style={styles.title}>Do you have any injuries or pain?</Text>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card
              style={[
                {
                  backgroundColor: theme.colors.white,
                  borderColor: theme.colors.secondary,
                  borderWidth: 0.3,
                  borderRadius: 10,
                  width: '45%',
                  height: 200,
                  margin: 10,
                  marginBottom: 10,
                },
                isSelected(item.id) && styles.selectedItem,
              ]}
              onPress={() => onSelect(item.id)}>
              <Card.Title title={item.title} />
              <Card.Content></Card.Content>
              <Card.Cover
                style={{
                  width: '70%',
                  height: '70%',
                }}
                source={item.img}
              />
            </Card>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
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
    selectedItem: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
  });

export default DisabilitiesSelection;
