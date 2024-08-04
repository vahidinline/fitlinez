import { Image, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { getListOfTrainers } from '../../api/getTrainerData';

const TrainerItem = ({ item }) => {
  console.log(item);
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
  const [trainersList, setTrainersList] = useState([]);

  useEffect(() => {
    getListOfTrainers().then((data) => {
      setTrainersList(data);
    });
  }, []);
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
