import { Image, Text, useTheme } from '@rneui/themed';
import React from 'react';
import { View, FlatList } from 'react-native';

const trainersList = [
  { id: 1, name: 'Trainer 1', img: 'https://picsum.photos/200/300' },
  { id: 2, name: 'Trainer 2', img: 'https://picsum.photos/200/300' },
  { id: 3, name: 'Trainer 3', img: 'https://picsum.photos/200/300' },
  { id: 4, name: 'Trainer 4', img: 'https://picsum.photos/200/300' },
  { id: 5, name: 'Trainer 5', img: 'https://picsum.photos/200/300' },
  { id: 6, name: 'Trainer 6', img: 'https://picsum.photos/200/300' },
  { id: 7, name: 'Trainer 7', img: 'https://picsum.photos/200/300' },
  { id: 8, name: 'Trainer 8', img: 'https://picsum.photos/200/300' },
];

const TrainerItem = ({ item }) => {
  return (
    <View
      style={{
        margin: 10,
        alignItems: 'center',
      }}>
      <Image
        source={{ uri: item.img }}
        style={{ width: 80, height: 80, borderRadius: 15 }}
      />
      <Text
        style={{
          fontSize: 15,
          fontWeight: 'bold',
          marginTop: 10,
        }}>
        {item.name}
      </Text>
    </View>
  );
};

function TrainersList() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        margin: 10,
        justifyContent: 'space-between',
        marginBottom: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 0,
          marginHorizontal: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginHorizontal: 20,
            marginTop: 20,
          }}>
          Trainers
        </Text>
        <Text
          style={{
            fontSize: 15,
            //fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 20,
            textDecorationLine: 'underline',
            color: theme.colors.secondary,
          }}>
          see all
        </Text>
      </View>
      <FlatList
        data={trainersList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TrainerItem item={item} />}
        numColumns={4}
      />
    </View>
  );
}

export default TrainersList;
