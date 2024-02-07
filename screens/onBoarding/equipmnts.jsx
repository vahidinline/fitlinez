import { Button, Text, useTheme } from '@rneui/themed';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import Dumbbell from '../../assets/img/dumbbell.jpeg';
import Kettlebll from '../../assets/img/kettlebell.jpeg';
import Barbell from '../../assets/img/barbell.jpeg';
import CurlBar from '../../assets/img/curlBar.jpeg';
import { Card } from 'react-native-paper';

function EquipmentSelection() {
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
      title: 'Dumbbells',
      img: Dumbbell,
    },
    {
      id: 2,
      title: 'Kettlebells',
      img: Kettlebll,
    },
    {
      id: 3,
      title: 'Barbells',
      img: Barbell,
    },
    {
      id: 4,
      title: 'Curl Bars',
      img: CurlBar,
    },
  ];
  return (
    <View>
      <Text style={styles.title}>How often do you want to workout?</Text>
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

export default EquipmentSelection;
