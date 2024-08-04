import React, { useEffect, useState } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { getTrainerPlans } from '../../api/getTrainerData';
import { Image, Text } from '@rneui/base';
import { useTheme } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

function TrainerPlan(trainerId) {
  const [trainerPlans, setTrainerPlans] = useState([]);
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    getTrainerPlans(trainerId).then((data) => {
      setTrainerPlans(data);
    });
  }, []);

  return (
    <View>
      <FlatList
        data={trainerPlans}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 50,
              //marginTop: 100,
            }}>
            <Text
              style={{
                fontSize: 10,
                color: theme.colors.secondary,
                alignContent: 'center',
                justifyContent: 'center',
                fontFamily: 'Vazirmatn',
              }}>
              No Plans Available
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PlanItem', {
                  item: item,
                });
              }}>
              <Image
                source={{ uri: item.image }}
                style={{ width: 80, height: 80, borderRadius: 15 }}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                // fontWeight: 'bold',
                color: theme.colors.secondary,
                // marginTop: 10,
                fontFamily: 'Vazirmatn',
                marginHorizontal: 10,
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              {item.name}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

export default TrainerPlan;
