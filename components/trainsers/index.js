import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Text } from '@rneui/themed';
import { Image } from '@rneui/themed';
import axios from 'axios';

function Trainers() {
  const navigation = useNavigation();
  const [trainers, setTrainers] = useState([]);
  console.log(trainers);
  const getTrain = async () => {
    try {
      await axios
        .get('http://192.168.1.6:8080/trainer/api/trainerlogin')
        .then((response) => {
          setTrainers(response.data.data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTrain();
  }, []);

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Trainers" />
      </Appbar.Header>

      {trainers.map((trainer) => {
        return (
          <View>
            <Text> {trainer.name} </Text>
          </View>
        );
      })}
    </SafeAreaView>
  );
}

export default Trainers;
