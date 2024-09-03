import { Image, Text, useTheme } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { getListOfTrainers } from '../../api/getTrainerData';
import { useNavigation } from '@react-navigation/native';

const TrainerItem = ({ item }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  return (
    <View
      style={{
        margin: 10,
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('trainer', {
            item: item,
          });
        }}>
        <Image
          source={{ uri: item.photo }}
          style={{
            width: Dimensions.get('window').width / 3,
            height: Dimensions.get('window').width / 3,
            borderRadius: 15,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            //right: 2,
            //left: 10,
            backgroundColor: theme.colors.background,
            width: '100%',
            opacity: 0.8,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              // marginTop: 10,
              padding: 3,
              fontFamily: 'Vazirmatn',
              color: theme.colors.secondary,
            }}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

function TrainersList({ i18n }) {
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
          // justifyContent: 'space-between',
          marginTop: 0,
          marginBottom: 0,
          marginHorizontal: 10,
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            //fontWeight: 'bold',
            marginHorizontal: 20,
            // marginTop: 20,
            textAlign: 'center',
            fontFamily: 'Vazirmatn',
            justifyContent: 'center',
            color: theme.colors.secondary,
          }}>
          {i18n.t('trainers')}
        </Text>
        {/* <Text
          style={{
            fontSize: 15,
            //fontWeight: 'bold',
            marginHorizontal: 10,
            marginTop: 20,
            textDecorationLine: 'underline',
            color: theme.colors.secondary,
          }}>
          see all
        </Text> */}
      </View>
      <FlatList
        scrollEnabled={true}
        horizontal={true}
        data={trainersList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <TrainerItem item={item} />}
      />
    </View>
  );
}

export default TrainersList;
