import React from 'react';
import { FlatList } from 'react-native';
import { useTheme } from '@rneui/themed';
import { View } from 'react-native';
import CardItem from './CardItem';
import Header from '../../../components/header';

function WorkoutListIndex({ route }) {
  const { theme } = useTheme();
  const { packages, name } = route.params;

  return (
    <View style={{ backgroundColor: theme.colors.background, paddingTop: 50 }}>
      <Header title={name} />

      <FlatList
        data={packages}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={(item) => item.name}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

export default WorkoutListIndex;
