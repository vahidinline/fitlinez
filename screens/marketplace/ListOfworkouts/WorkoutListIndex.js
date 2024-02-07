import React from 'react';
import { Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native';
import WorkoutListItems from './ListItems';
import { Icon, useTheme } from '@rneui/themed';
import { Text } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import { View } from 'react-native';
import CardItem from './CardItem';
import Header from '../../../components/header';

function WorkoutListIndex({ route, navigation }) {
  const { theme } = useTheme();
  //const navigation = useNavigation();
  const { packages, name } = route.params;

  return (
    <View style={{ backgroundColor: theme.colors.background, paddingTop: 50 }}>
      <Header title={name} />

      <FlatList
        data={packages}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default WorkoutListIndex;
